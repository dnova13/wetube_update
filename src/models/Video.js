import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true }, // required 넣어서 필수로 들어가게 요구
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }, // 기본값은 지금시간으로 지정
  hashtags: [{ type: Number }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
