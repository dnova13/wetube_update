import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {

  // poulate videos 데이터에 사용힌 사용자 정보 추가
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");

  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params; // 비디오 아이디 검색

  // popluate : join 기능 생각하면된, 
  const video = await Video.findById(id).populate("owner");

  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;

  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  /// 해당 사용자만 수정할 수 있게 유효성 검사
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }

  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });

  if (!video) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  // 해당 사용자만 수정할 수 잇게 유효성 검사
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id }, // 사용자 아이디 추가
  } = req.session;
  const { video, thumb } = req.files; // 업로드 파일
  const { title, description, hashtags } = req.body;
  
  try {
    const newVideo = await Video.create({ // 생성한 값이 반환하도록 수정
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id, // owner 에 사용자 아이디 저장하도록 넣음
      hashtags: Video.formatHashtags(hashtags),
    });

    // 기능 최적화를 위해서 업로드 하는 사용자 db에
    // 업로드한 영상아이디를 같이 삽입
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");
  } catch (error) {
    console.log(error); 
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  // 해당 사용자만 삭제 가능하도록 유효성 검사
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {

    // poulate videos 데이터에 사용힌 사용자 정보 추가
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};


export const createComment = (req, res) => {
  console.log(req.params);
  console.log(req.body);
  return res.end();
};
