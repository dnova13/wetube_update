import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {  // 미들웨어 사용할 함수 형성 
    console.log(`${req.method} ${req.url}`); // `GET /` 로 출력
    next();
};

const handleHome = (req, res) => {
    return res.send("I love middlewares");
};

const privateMiddleware = (req, res, next) => {
    const url = req.url;

    // 미들웨어를 통해 필터 처리하고, 여기서 로그인 토큰 처리등을 함.
    // /protect 만 입력할 경우 not allow로 걸러지고
    // /protect?a=1 등으로 입력핳 경우 다음으로 넘어감.
    if (url === "/protect") {
        return res.send("not allow")
    }
    console.log("al")
    next();
}

const handleProtect = (req, res) => {
    return res.send("yor can use protected info");
};

app.use(logger)
app.use(privateMiddleware);
app.get("/", handleHome); // logger() 미들 웨어 요청
app.get("/protect", handleProtect)

const handleListening = () =>
    console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);