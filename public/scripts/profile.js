var currentUser;
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUser = db.collection("users").doc(user.uid);
    insertNameFromFirestore(user);
    insertEmailFromFirestore(user);
  } else {
    console.log("No user logged in");
  }
});

function insertNameFromFirestore(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      console.log(userDoc.data().name);
      userName = userDoc.data().name;
      console.log(userName);
      document.getElementById("name-goes-here").innerHTML = userName;
    });
}

function insertEmailFromFirestore(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      console.log(userDoc.data().email);
      userEmail = userDoc.data().email;
      console.log(userEmail);
      document.getElementById("email-goes-here").innerHTML = userEmail;
    });
}

window.onload = function () {
  document
    .getElementById("imageUpload")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) {
        console.log("No file selected");
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
          console.log("Uploaded a file!");
          snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
              console.log("File available at", downloadURL);
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
      console.log("logging out user");
      window.location.href = "../../index.html";
    })
    .catch((error) => {});
}

document.addEventListener("DOMContentLoaded", function () {
  var logoutButton = document.getElementById("logout");
  if (logoutButton) {
    console.log("Logout button found");
    logoutButton.addEventListener("click", logout);
  } else {
    console.log("Logout button not found");
  }
});

document.getElementById("learnMore").onclick = function () {
  location.href = "../../app/html/aboutUs.html";
};

var mainLocationHere;
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
          mainLocationHere = doc.id;
          saveLocation();
          console.log(mainLocationHere);
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
    console.log(location);
  }
}
