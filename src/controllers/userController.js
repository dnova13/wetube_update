import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });

  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }

  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";

  // 일반적인 로그인이므로 수정, 소셜 로그인인지 체크할 필요 잇음.
  const user = await User.findOne({ username, socialOnly: false });

  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };

  // URLSearchParams 에서 서치 파라미터를 형성해줌.
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  // 액세트 토큰 코드 간략화.
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  // json 내에 access_token 코드 있는지 검사
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        }
      })
    ).json();

    // 이메일 데이터만 추출
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
        // page: 1,
        // per_page: 1,
      })
    ).json();

    // emailData에서 find() 를 통해 primary, verified 가 true 인지 조건을 찾아 비교.
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      // set notification
      return res.redirect("/login");
    } else {

      // db 작업
      // db 접속하여 같은 이메일 주소가 있는지 검색
      let user = await User.findOne({ email: emailObj.email });

      // 중복된 코드 수정, 코드 간략화
      if (!user) {
        user = await User.create({
          avatarUrl: userData.avatar_url,
          name: userData.name,
          username: userData.login,
          email: emailObj.email,
          password: "",
          socialOnly: true, // 소셜 로그인인지 체크
          location: userData.location,
        });
      }

      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

// 로그 아웃 동작 세션 제거 
export const logout = (req, res) => {
  req.session.destroy(); 
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};


export const postEdit = async (req, res) => {

  // js 표현 이런식으로 _id, name 등의 변수를 req 에서 찾아서 받음.
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;

  // 메일 중복 검사 
  if (req.session.user.email !== email) {

    const exists = await User.exists({ email });

    if (exists) {
      console.log("dup email")
      return res.status(400).render("edit-profile", {
        errorMessage: "This email is already taken.",
      });
    }
  }

  // 사용자 이름 중복 검사 
  if (req.session.user.username !== username) {

    console.log(req.session.user.username);
    const exists = await User.exists({ username });

    if (exists) {
      console.log("dup name")
      return res.status(400).render("edit-profile", {
        errorMessage: "This name is already taken.",
      });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(_id,
    {
      name,
      email,
      username,
      location,
    },
    { new: true }
  );

  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};


export const getChangePassword = (req, res) => {

  // 만약 소셜 로그인인데 이 url 로 침투할경우 쫓아냄.
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;


  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);

  // 이전 암호 유효성 체크
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }

  // 새로 변경될 암호 유효성 체크
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  user.password = newPassword;

  await user.save();
  return res.redirect("/users/logout");
};

export const see = (req, res) => res.send("See User");
