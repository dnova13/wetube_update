const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");  // 새로운 댓글 태그 생성
  newComment.dataset.id = id; // 댓글 아이디 입력
  newComment.className = "video__comment"; // 클래스 입력
  const icon = document.createElement("i"); // 아이콘 태그 샛성
  icon.className = "fas fa-comment"; // 아이콘 클래스 네임 지정
  const span = document.createElement("span"); // sapn 태그 생성
  span.innerText = ` ${text}`; // 댓글 텍스트 사빕
  const span2 = document.createElement("span"); // 아이콘 삽입
  span2.innerText = "❌";

   //  <li> <i></i><span></span> </li> 순으로 <li> 태그에 산입
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);

  /// 댓글 태그 ui에 맨 압쪽에 댓글을 삽입함.
  videoComments.prepend(newComment);

  // 댓글을 맨 뒷쪽에 삽입함.
  // videoComments.appendChild(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
