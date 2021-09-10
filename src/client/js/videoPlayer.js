const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");

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

// 영상의 총 길이 설정
const handleLoadedMetadata = () => {
  totalTime.innerText = Math.floor(video.duration);
};

// 현재 영상의 시간 설정.
const handleTimeUpdate = () => {
  currenTime.innerText = Math.floor(video.currentTime);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);

// loadedmetadata 비디오를 제외한 메타데이터 길이, 크기등이 실행되는 이벤트가 발생할때, 메소드를 동작시킴
video.addEventListener("loadedmetadata", handleLoadedMetadata);

// 시간이 변경되는 이벤트가 생길때 동작
video.addEventListener("timeupdate", handleTimeUpdate);