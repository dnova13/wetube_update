const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

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
    // 음소거 버튼시 볼륨 동작 추가
    volumeRange.value = video.muted ? 0 : volumeValue;
};

// 볼륨 변화 메소드
const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    // 변화된 볼륜 값을 받음.

    // 만약 음소거 상태에서 움직일때 
    // 음소거 상태 해제
    // 다른 조건이라면 음향 조절 안되게 막을 수 도 잇음.
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }

    /// 변경된 볼륨값을 기본값으로 재설정.
    volumeValue = value;

    // 변경된 볼률값을 영상 볼륨에 반영.
    video.volume = value;
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
