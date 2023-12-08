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

//------------------------------------------------
// So, a new post document has just been added
// and it contains a bunch of fields.
// We want to store the image associated with this post,
// such that the image name is the postid (guaranteed unique).
// 
// This function is called AFTER the post has been created, 
// and we know the post's document id.
//------------------------------------------------
function uploadPic(postDocID) {
  var storageRef = storage.ref("images/" + postDocID + ".jpg");

  storageRef
    .put(ImageFile)

    // AFTER .put() is done
    .then(function () {
      storageRef.getDownloadURL().then(function (url) {

        // Now that the image is on Storage, we can go back to the
        // post document, and update it with an "image" field
        // that contains the url of where the picture is stored.
        db.collection("photos")
          .doc(postDocID)
          .update({
            image: url, // Save the URL into users collection
          })
          .then(function () {

            // One last thing to do:
            // save this postID into an array for the OWNER
            // so we can show "my posts" in the future
            // savePostIDforUser(postDocID);
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
