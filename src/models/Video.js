import mongoose from "mongoose";

// 데이터 타입을 미리 정하면 좋은 이유.
// 유효성 검사로 데이터 타입이 다르면 에러를 던져내서 못 올리게 함.
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
