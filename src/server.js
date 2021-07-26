import express from "express";

const PORT = 4000;

const app = express();

const handleHome = (req, res) => {
    return res.send("I still love you.");
};
const handleLogin = (req, res) => {
    return res.send("Login here.");
};

const handlePost = (req, res) => {
    return res.send("post res.");
};

/// 코드 축약 get 으로 쓸게 정해저 있다면
// use("path", [함수명]) 쓰지 말고 아래 get 처럼 해도됨.
app.get("/", handleHome);
app.get("/login", handleLogin);
app.post("/post", handlePost); // post 라우터 메소드 핸들
// 웹창 주소로 안됨. 포스트 맨이랑 확장앱 이용하면 볼수 있음.


const handleListening = () =>
    console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
