const storage = firebase.storage();

var reviewLocation;

function addReview() {
  const collectionRef = db.collection("searches");
  collectionRef.get().then((querySnapshot) => {
    const dropdownMenu = document.getElementById("dropdown-menu");
    querySnapshot.forEach((doc) => {
      const option = document.createElement("option");
      option.text = doc.data().name;
      dropdownMenu.add(option);
    });
  });

  const dropdownMenu = document.getElementById("dropdown-menu");
  dropdownMenu.addEventListener("change", (event) => {
    const selectedName = event.target.value;
    collectionRef
      .where("name", "==", selectedName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          reviewLocation = doc.id;
        });
      });
  });
}

addReview();

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

document.getElementById("submit").onclick = function () {
  savePost();
};

function savePost() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      db.collection("photos")
        .add({
          owner: user.uid,
          last_updated: firebase.firestore.FieldValue.serverTimestamp(), //current system time
          locationID: reviewLocation,
        })
        .then((doc) => {
          uploadPic(doc.id);
        });
    } else {
    }
  });
}

function uploadPic(postDocID) {
  var storageRef = storage.ref("images/" + postDocID + ".jpg");

  storageRef
    .put(ImageFile)
    .then(function () {
      storageRef.getDownloadURL().then(function (url) {
        db.collection("photos")
          .doc(postDocID)
          .update({
            image: url,
          })
          .then(function () {
            swal(
              {
                title: "Success!",
                text: "Redirecting in 2 seconds.",
                type: "success",
                timer: 2000,
                showConfirmButton: false,
              },
              function () {
                window.location.href = "../../app/html/add.html";
              }
            );
          });
      });
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}
