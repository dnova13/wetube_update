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
  const user = await User.findOne({ username });
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
      return res.redirect("/login");
    } else {

      // db 작업
      // db 접속하여 같은 이메일 주소가 있는지 검색
      const existingUser = await User.findOne({ email: emailObj.email });
      
      // 잇다면 세션에 로그인 정보 박음
      if (existingUser) {
        req.session.loggedIn = true;
        req.session.user = existingUser;
        return res.redirect("/");
      } 
      
      // 없을 경우 새로 user 계정 db 만든 후 세션에 박음.
      // 이때 패스워드 없는 경우, 서드 파티 로그인라는거 추측 가능.
      else {
        const user = await User.create({
          name: userData.name,
          username: userData.login,
          email: emailObj.email,
          password: "",
          socialOnly: true, // 소셜 로그인인지 체크
          location: userData.location,
        });
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
      }
    }
  } else {
    return res.redirect("/login");
  }
};


export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
