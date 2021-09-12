const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: { // form 을 보낼때 이렇게 body 에 묶어서 데이터 보냄
      text, // text : text -> text 를 간략한 한거.
    },
  });
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
