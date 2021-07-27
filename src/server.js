import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

console.log(process.cwd());  /// process.cwd() : 해당 프로젝트 경로 

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); // view engin pug 로 셋팅
app.set("views", process.cwd() + "/src/views"); // view 파일 경로 셋팅

app.use(logger);
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
