import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

// aws s3 setting
const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

// multer s3 setting
const muler3Storage = multerS3({
  s3: s3,
  bucket: "youtube-clone-upload",
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

// 로그인 경우 그 다음 상황으로 진행
// 아닌 경우 로깅 페이지로 리다렉
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

// 로그인 안된 경우 그 다음 상황으로 진행
// 아닌 경우 홈으로 리다렉
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

// s3를 쓰므로 이제 dest가 저장 우선이 아닌 storage : muler3Storage 에 저장함.muler3Storage
export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  // storage: muler3Storage,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 20000000, // 단위는 byte
  },
  storage: muler3Storage,
});