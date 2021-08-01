import express from "express";
import {
  watch,
  getUpload,
  getEdit,
  postEdit,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

/// 정규식 변경 
/// id는 24글자에 특문 제외한 16진수 문자 암호화 방식이므로.
/// 이 조건에 해당하는 정규식으로 변경.
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
