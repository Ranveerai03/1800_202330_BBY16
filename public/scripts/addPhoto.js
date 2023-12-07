var reviewLocation;

function addReview() {
  const collectionRef = db.collection("searches");
  console.log(collectionRef);
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
    console.log(selectedName);
    collectionRef
      .where("name", "==", selectedName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          reviewLocation = doc.id;
          console.log(reviewLocation);
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
          console.log("1. Post document added!");
          console.log(doc.id);
          uploadPic(doc.id);
        });
    } else {
      console.log("Error, no user signed in");
    }
  });
}

function uploadPic(postDocID) {
  console.log("inside uploadPic " + postDocID);
  var storageRef = storage.ref("images/" + postDocID + ".jpg");

  storageRef
    .put(ImageFile)
    .then(function () {
      console.log("2. Uploaded to Cloud Storage.");
      storageRef.getDownloadURL().then(function (url) {
        console.log("3. Got the download URL.");
        db.collection("photos")
          .doc(postDocID)
          .update({
            image: url,
          })
          .then(function () {
            console.log("4. Added pic URL to Firestore.");
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
      console.log("error uploading to cloud storage");
    });
}
