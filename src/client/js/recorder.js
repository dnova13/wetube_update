const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;

const handleStop = () => {
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleStop); /// 스탑 이벤트 제거
  startBtn.addEventListener("click", handleStart); /// 레코딩 이벤트 재삽입
};

const handleStart = () => {
    startBtn.innerText = "Start Recording";
    startBtn.removeEventListener("click", handleStop); /// 스탑 이벤트 제거
    startBtn.addEventListener("click", handleStart); /// 레코딩 이벤트 재삽입

  const recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (e) => {
    console.log("recording done");
    console.log(e);
    console.log(e.data);
  };

  console.log(recorder); // 1. state : inactive
  recorder.start();
  console.log(recorder); // 2. state : recoding

  setTimeout(() => {
    recorder.stop();
  }, 10000);
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
