export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn); // 로그인 설정.
  res.locals.siteName = "Wetube"; // 사이트 이름 설정.
  res.locals.loggedInUser = req.session.user; // 유저 정보 저장
  next();
};
