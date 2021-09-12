import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {

    const ffmpeg = createFFmpeg({
        log: true,
        corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js'
    });

    await ffmpeg.load();

    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

    // 녹화한 파일 인코딩
    await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

    // 썸네일 파일 추출
    await ffmpeg.run(
        "-i",
        "recording.webm",
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        "thumbnail.jpg"
    );
    
    /// 변환한 아웃풋 파일 가져옴
    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

    // blob 파일로 변환
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

    // 파일 url 추출
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    // a 태그를 생성
    const a = document.createElement("a");

    // videoFrile objectUrl 삽입
    a.href = mp4Url;
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();

    const thumbA = document.createElement("a");
    thumbA.href = thumbUrl;
    thumbA.download = "MyThumbnail.jpg";
    document.body.appendChild(thumbA);
    thumbA.click();
    
    // unlink 하여 파일을 메모리부터 버리고
    ffmpeg.FS("unlink", "recording.webm");
    ffmpeg.FS("unlink", "output.mp4");
    ffmpeg.FS("unlink", "thumbnail.jpg");

    // URL.revokeObjectURL  파일 obejectUrl 도 삭제
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl); 
    URL.revokeObjectURL(videoFile);
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
