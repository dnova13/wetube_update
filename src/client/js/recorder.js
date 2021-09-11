const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
    
    // a 태그를 생성
    const a = document.createElement("a");

    // videoFrile objectUrl 삽입
    a.href = videoFile;
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();
};


const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop();
};

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    /// 영상 mimeType 지정.
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {

        // createObjectURL() 브라우저 메모리에서 가능한 url을 만들어줌.
        videoFile = URL.createObjectURL(event.data);
        /// URL.createObjectURL() 을 이용하여
        /// 녹화 완료후 받은 blob 파일을 
        /// 브라우저에 사용가능한 objectURL 로 만들어줌 (즉 scr 로 만들어줌)

        video.srcObject = null; // 미리보기 비디오 제거
        video.src = videoFile; // 녹확된 비디오 src 삽입
        video.loop = true; /// 비디들 반복 재생하게 만듬 ,  기본은 false
        video.play();
    };
    recorder.start();
};

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject = stream;
    video.play();
};

init();

startBtn.addEventListener("click", handleStart);
