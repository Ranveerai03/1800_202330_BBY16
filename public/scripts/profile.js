//----------------------------------------------------------
// Initialize Firebase Auth and get the current user.
//----------------------------------------------------------
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    insertNameFromFirestore(user);
    insertEmailFromFirestore(user);
  } else {
    // Handle user not logged in
  }
});

//----------------------------------------------------------
// Function to insert the User's Name on this page.
//----------------------------------------------------------
function insertNameFromFirestore(user) {
  db.collection("users").doc(user.uid).get().then(userDoc => {
      console.log(userDoc.data().name)
      userName = userDoc.data().name;
      console.log(userName)
      document.getElementById("name-goes-here").innerHTML = userName;
  })
}
insertNameFromFirestore();

//----------------------------------------------------------
// Function to insert the User's Email on this page.
//----------------------------------------------------------
function insertEmailFromFirestore(user) {
  db.collection("users").doc(user.uid).get().then(userDoc => {
      console.log(userDoc.data().email)
      userEmail = userDoc.data().email;
      console.log(userEmail)
      document.getElementById("email-goes-here").innerHTML = userEmail;
  })
}
insertEmailFromFirestore();

//------------------------------------------------------------------------------
// Function to change profile images on profile.html
//------------------------------------------------------------------------------
  window.onload = function(){" "}
  {document
    .getElementById("imageUpload")
    .addEventListener("change", function (event) {
      // Create a new FileReader object
      const reader = new FileReader();
      // When the file is read successfully, set it as the source of the profile image
      reader.onload = function () {
        // Get the image element by its ID
        const img = document.getElementById("profileImage");
        // Set the source of the image element to the file content
        img.src = reader.result;
      };
      // Start reading the first file selected by the user
      // This will trigger the 'onload' event after the file is read
      reader.readAsDataURL(event.target.files[0]);
    })}
  ;

  document.getElementById("aboutus").onclick = function () {
    location.href = "../../app/html/aboutUs.html";
  };
