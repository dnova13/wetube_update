const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtnArr = document.querySelectorAll(".deleteBtn");

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
  span2.className = "deleteBtn"; // 아이콘 클래스 네임 지정
  span2.innerText = "❌";
  span2.addEventListener("click", handleDelete);

   //  <li> <i></i><span></span> </li> 순으로 <li> 태그에 산입
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);

  /// 댓글 태그 ui에 맨 압쪽에 댓글을 삽입함.
  videoComments.prepend(newComment);

  // 댓글을 맨 뒷쪽에 삽입함.
  // videoComments.appendChild(newComment);
};

const deleteComment = (e) => {

  const commentContainer = document.querySelector(".video__comments ul");
  const commentList = e.target.parentNode;
  commentContainer.removeChild(commentList);    
}

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

const handleDelete = async (event) => {

  const commentList = event.target.parentNode; // 하위 노드 검색
  const commentId = commentList.dataset.id;
  const videoId = videoContainer.dataset.id;

  const response = await fetch(`/api/comments/${commentId}/delete`, {
      method: "DELETE",
      headers: {
          "Content-Type" : "application/json"
      },
      body : JSON.stringify({
          videoId,
      })
  });
  if(response.status === 201) {
      deleteComment(event);
  }
  if(response.status === 403) {
      alert("Not Authorized");
  }
}


if (form) {
  form.addEventListener("submit", handleSubmit);
}

for (let i = 0; i< deleteBtnArr.length; i++) {
  deleteBtnArr[i].addEventListener("click", handleDelete);
}