import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/youtube_clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

// db 에러가 나면 이벤트 발행
// on 여러가지 이벤틀을 여러번 발생함
db.on("error", handleError);

// db가 정상정으로 접속되면 이벤트 발생
// once 오직 한번만 발동되게
db.once("open", handleOpen);
