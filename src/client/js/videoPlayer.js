const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

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
const handlePause = () => (playBtn.innerText = "Play");
const handlePlay = () => (playBtn.innerText = "Pause");

const handleMute = (e) => {};

playBtn.addEventListener("click", handlePlayClick); 
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
