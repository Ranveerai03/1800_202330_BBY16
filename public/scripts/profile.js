//----------------------------------------------------------
// Initialize Firebase Auth and get the current user.
// Checks if a user is logged in and updates the profile information accordingly
//----------------------------------------------------------
var currentUser;
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUser = db.collection("users").doc(user.uid);
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
      window.location.href = "../../index.html"; // Redirect to login page
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
document.getElementById("learnMore").onclick = function () {
  location.href = "../../app/html/aboutUs.html";
};
var mainLocationHere;
function addReview() {
    const collectionRef = db.collection("searches");
    console.log(collectionRef);
    collectionRef.get().then((querySnapshot) => {
        const dropdownMenu = document.getElementById('dropdown-menu');
        querySnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.text = doc.data().name;
            dropdownMenu.add(option);
            
        });
    });
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.addEventListener('change', (event) => {
        // Do something with the selected item
        const selectedName = event.target.value;
        console.log(selectedName);
        collectionRef.where('name', '==', selectedName).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Do something with the data
                mainLocationHere = doc.id;
                saveLocation();
                console.log(mainLocationHere);
            });
        });
    });
  }

  addReview();

  function saveLocation(){
    currentUser.update({
      mainLocation: mainLocationHere
    })
    .then(() => {
      swal({
        title: "Success!",
        text: "Main Card Location is saved.",
        timer: 2000
      });
  })
  }

  // function setLocation() {
  //   var location = prompt("Please enter your location", "");
  //   if (location != null) {
  //     // Do something with the location variable
  //     console.log(location);
  //   }
  // }

  function setLocation() {
    document.getElementById("custom-text-box").style.display = "block";
  }
  
  function saveLocations() {
    var location = document.getElementById("location-input").value;
    if (location != "") {
      // Do something with the location variable
      currentUser.update({
        weatherLocation: location
      }).then(() => {
        swal({
          title: "Success!",
          text: "Weather Location is saved.",
          timer: 2000
        });
    })
      console.log(location);
    }
  }
  
  
  