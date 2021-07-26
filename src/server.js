import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {  // 미들웨어 사용할 함수 형성 
    console.log(`${req.method} ${req.url}`); // `GET /` 로 출력 
    console.log("1111)");
    next();
};

const handleHome = (req, res) => {
    return res.send("I love middlewares");
};

app.get("/", logger, handleHome); // logger() 미들 웨어 요청

const handleListening = () =>
    console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);