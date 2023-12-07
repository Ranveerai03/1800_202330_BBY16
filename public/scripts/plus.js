function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function savePost() {
  alert("SAVE POST is triggered");
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var desc = document.getElementById("description").value;
      db.collection("posts")
        .add({
          owner: user.uid,
          description: desc,
          last_updated: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((doc) => {
          uploadPic(doc.id);
        });
    } else {
    }
  });
}

var ImageFile;
function listenFileSelect() {
  var fileInput = document.getElementById("mypic-input");
  const image = document.getElementById("mypic-goes-here");
  fileInput.addEventListener("change", function (e) {
    ImageFile = e.target.files[0];
    var blob = URL.createObjectURL(ImageFile);
    image.src = blob;
  });
}
listenFileSelect();
