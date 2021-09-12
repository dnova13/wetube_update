import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn"); 
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

// 변환을 위한 파일 이름 지정.
const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};

// 페이크 ancho 만들어서 다운로드한는거 함수화
const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};

const handleDownload = async () => {

    /// 파일 변환 중으로 버튼 변경하고 이벤트 동작들 제거하여 사용못하게 함.
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({
        log: true,
        corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js'
    });

    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    // 녹화한 파일 인코딩
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);

    // 썸네일 파일 추출
    await ffmpeg.run(
        "-i",
        files.input,
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.output
    );

    /// 변환한 아웃풋 파일 가져옴
    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);

    // blob 파일로 변환
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

    // 파일 url 추출
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    // a 태그를 생성
    const a = document.createElement("a");

    // 파일 다운로드
    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbUrl, "MyThumbnail.jpg");

    // unlink 하여 파일을 메모리부터 버리고
    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    // URL.revokeObjectURL  파일 obejectUrl 도 삭제
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);
    
    // 최종 다운 로드 완료 후
    // 이전 녹화 상태로 초기화
    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again";
    actionBtn.addEventListener("click", handleStart);
};


const handleStop = () => {
    actionBtn.innerText = "Download Recording";
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);

    recorder.stop();
};

const handleStart = () => {
    actionBtn.innerText = "Stop Recording";
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleStop);

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

actionBtn.addEventListener("click", handleStart);
