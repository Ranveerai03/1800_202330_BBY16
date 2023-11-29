//----------------------------------------------------------
// Initialize Firebase Auth and get the current user.
// Checks if a user is logged in and updates the profile information accordingly
//----------------------------------------------------------
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    insertNameFromFirestore(user);
    insertEmailFromFirestore(user);
  } else {
    // Handle user not logged in
    console.log("No user logged in");
  }
});

//----------------------------------------------------------
// Function to Fetch and Display User's Name from Firestore.
//----------------------------------------------------------
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

//----------------------------------------------------------
// Function to Fetch and Display User's Email from Firestore.
//----------------------------------------------------------
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

//------------------------------------------------------------------------------
// Function to change profile images on profile.html
//------------------------------------------------------------------------------
window.onload = function () {
  document
    .getElementById("imageUpload")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) {
        console.log("No file selected");
        return;
      }

      // Generate a unique file name using the user's UID and current timestamp
      const user = firebase.auth().currentUser;
      const uniqueFileName = `${user.uid}-${Date.now()}-${file.name}`;

      // Create a reference to Firebase Storage
      const storageRef = firebase
        .storage()
        .ref("profile_images/" + uniqueFileName);

      // Upload the file
      storageRef
        .put(file)
        .then(function (snapshot) {
          console.log("Uploaded a file!");

          // Get the download URL
          snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
              console.log("File available at", downloadURL);

              // Update the user profile image in Firestore
              db.collection("users").doc(user.uid).update({
                profileImageUrl: downloadURL,
              });

              // Update the image on the page
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

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("logging out user");
      window.location.href = "../../app/html/index.html"; // Redirect to login page
    })
    .catch((error) => {
      // An error happened.
    });
}

//------------------------------------------------
// Logout Button Event Listener
//-------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Other event listeners and code
  var logoutButton = document.getElementById("logout");
  if (logoutButton) {
    console.log("Logout button found");
    logoutButton.addEventListener("click", logout);
  } else {
    console.log("Logout button not found");
  }
});

// About Us Page Navigation
document.getElementById("aboutus").onclick = function () {
  location.href = "../../app/html/aboutUs.html";
};
