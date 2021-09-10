const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");


// 기본 볼륨 값 설정
let volumeValue = 0.5;
video.volume = volumeValue;

// 비디오 클릭시 이벤트 설정. 코드 간략화
const handlePlayClick = (e) => {

    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }

    playBtn.innerText = video.paused ? "Play" : "Pause";
};

// 음소거 이벤트 메소드
const handleMuteClick = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

// 볼륨 변화 메소드
const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;

    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }

    volumeValue = value;
    video.volume = value;
};


// 시간 포맷팅
const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(11, 8);


// 플레이어 이니셜 설정
const handleLoadedMetadata = () => {
    /// 총 길이 설정
    totalTime.innerText = formatTime(Math.floor(video.duration));
    /// 타임라인 최대값 설정.
    timeline.max = Math.floor(video.duration);
};

// 시간에 따른 영상의 변화 셋팅
const handleTimeUpdate = () => {
    /// 현재 영상 시간 설정
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    /// 타임라인 변화 값 설정
    timeline.value = Math.floor(video.currentTime);
};

/// 타임 라인 조작 설정.
const handleTimelineChange = (event) => {
    const {
        target: { value },
    } = event;

    video.currentTime = value;
};

// 풀스크린 동작 핸들로
const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;

    if (fullscreen) {
        document.exitFullscreen(); // 풀스크린 해제
        fullScreenBtn.innerText = "Enter Full Screen";
    } else {
        videoContainer.requestFullscreen(); // 풀스크린 on
        fullScreenBtn.innerText = "Exit Full Screen";
    }
};
  

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);

// 타임 라인 조작 이벤트(range)
timeline.addEventListener("input", handleTimelineChange);

// 풀스크린 클릭 이벤트 동작
fullScreenBtn.addEventListener("click", handleFullscreen);


// 새로고침 할경우
// JS에서 eventlistener을 추가하기 전에 video가 전부 로딩이 되어서
// handleLoadedMetadata() 가 아예 불러지지 않음.
// video.readyState가 4라는 뜻은 video가 충분히 불러와진 상태에서 handleLoadedMetadata() 실행하도록 함.
if (video.readyState == 4) {
    handleLoadedMetadata();
}