const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");

// 비디오 클릭시 이벤트 설정.
const handlePlayClick = (e) => {
  if (video.paused) { // 정지상태면 yes로 반환
    // playBtn.innerText = "Play"
    video.play(); // 영상 재생
  } else {
    // playBtn.innerText = "Stop"
    video.pause(); // 영상 멈춤.
  }
};

// 재생 일시 정지일때 이벤트 동작
const handlePause = () => (playBtn.innerText = "Play");
const handlePlay = () => (playBtn.innerText = "Pause");

const handleMuteClick = (e) => {
    if (video.muted) {
      video.muted = false;
    } else {
      video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  };

playBtn.addEventListener("click", handlePlayClick); 
muteBtn.addEventListener("click", handleMute);

// 미디어 이벤트 사용.
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
