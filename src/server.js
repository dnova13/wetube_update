import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev");
app.use(logger);

// 익스프레스에서 라우터 객체 형성 
const globalRouter = express.Router();
// req, res 함수 형성(api)
const handleHome = (req, res) => res.send("Home");
// router path '/' 지정
globalRouter.get("/", handleHome);


const userRouter = express.Router();
const handleEditUser = (req, res) => res.send("Edit User");
userRouter.get("/edit", handleEditUser);


const videoRouter = express.Router();
const handleWatchVideo = (req, res) => res.send("Watch Video");
videoRouter.get("/watch", handleWatchVideo);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>
    console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
