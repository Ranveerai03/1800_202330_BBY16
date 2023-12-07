const storage = firebase.storage();

var currentUser;
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUser = db.collection("users").doc(user.uid);
    insertNameFromFirestore(user);
    insertEmailFromFirestore(user);
  } else {
  }
});

function insertNameFromFirestore(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      userName = userDoc.data().name;
      document.getElementById("name-goes-here").innerHTML = userName;
    });
}

function insertEmailFromFirestore(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      userEmail = userDoc.data().email;
      document.getElementById("email-goes-here").innerHTML = userEmail;
    });
}

window.onload = function () {
  document
    .getElementById("imageUpload")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const user = firebase.auth().currentUser;
      const uniqueFileName = `${user.uid}-${Date.now()}-${file.name}`;
      const storageRef = firebase
        .storage()
        .ref("profile_images/" + uniqueFileName);
      storageRef
        .put(file)
        .then(function (snapshot) {
          snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
              db.collection("users").doc(user.uid).update({
                profileImageUrl: downloadURL,
              });
              document.getElementById("profileImage").src = downloadURL;
            })
            .catch(function (error) {
              console.error("Error getting download URL: ", error);
            });
        })
        .catch(function (error) {
          console.error("Error uploading file: ", error);
        });
    });
};

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "../../index.html";
    })
    .catch((error) => {});
}

document.addEventListener("DOMContentLoaded", function () {
  var logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  } else {
  }
});

document.getElementById("learnMore").onclick = function () {
  location.href = "../../app/html/aboutUs.html";
};

var mainLocationHere;
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
          mainLocationHere = doc.id;
          saveLocation();
        });
      });
  });
}

addReview();

function saveLocation() {
  currentUser
    .update({
      mainLocation: mainLocationHere,
    })
    .then(() => {
      swal({
        title: "Success!",
        text: "Main Card Location is saved.",
        timer: 2000,
      });
    });
}

function setLocation() {
  document.getElementById("custom-text-box").style.display = "block";
}

function saveLocations() {
  var location = document.getElementById("location-input").value;
  if (location != "") {
    currentUser
      .update({
        weatherLocation: location,
      })
      .then(() => {
        swal({
          title: "Success!",
          text: "Weather Location is saved.",
          timer: 2000,
        });
      });
  }
}
