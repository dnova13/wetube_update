import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },  
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // 댓글 단 사용자 정보
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" }, // 댓글 단 비디오 정보
  createdAt: { type: Date, required: true, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
