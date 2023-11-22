function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  // console.log(urlParams);
  return urlParams.get(name);
}

// Retrieve the location name from the URL
const locationName = getQueryParam('locationName');

// Display the location name on the page
const locationNameElement = document.getElementById('name-goes-here');
if (locationName) {
  locationNameElement.textContent = `${decodeURIComponent(locationName)}`;
} else {
  locationNameElement.textContent = 'Location not found';
}

// Retrieve the city name from the URL
const city = getQueryParam('city');

// Display the location name on the page
const cityElement = document.getElementById('city-goes-here');
if (city) {
  cityElement.textContent = `${decodeURIComponent(city)}` + ',';
} else {
  cityElement.textContent = 'Location not found';
}

// Retrieve the location name from the URL
const province = getQueryParam('province');

// Display the location name on the page
const provinceElement = document.getElementById('province-goes-here');
if (province) {
  provinceElement.textContent = `${decodeURIComponent(province)}`;
} else {
  provinceElement.textContent = 'Location not found';
}


// code for populating the reviews onto the page - TO BE UPDATED

function populateReviews() {
  // let cardTemplate = document.getElementById("hikeCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 
  let reviewCardTemplate = document.getElementById("card-template");
  let reviewCardGroup = document.getElementById("reviewCardGroup");

  let params = new URL(window.location.href); // Get the URL from the search bar
  let locationID = params.searchParams.get("id");
  console.log(locationID)
  // Double-check: is your collection called "Reviews" or "reviews"?
  db.collection("reviews")
    .where("locationID", "==", locationID)
    .get()
    .then((allReviews) => {
      reviews = allReviews.docs;
      reviews.forEach((doc) => {
        var condition = doc.data().condition;
        var icy = doc.data().icy;
        // var docID = doc.id;
        console.log("hello");
        var comment = doc.data().comment;
        var time = doc.data().timestamp.toDate();
        // let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.


        console.log(time);

        //assigning unique id to bookmark icon
        //attaching an onclick, calling callback function (with hike's id)
        // newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique
        // newcard.querySelector('i').onclick = () => saveBookmark(docID);

        let reviewCard = reviewCardTemplate.content.cloneNode(true);
        reviewCard.querySelector(".condition").innerHTML = condition;
        reviewCard.querySelector(".time").innerHTML = new Date(
          time
        ).toLocaleString();
        reviewCard.querySelector(".icy").innerHTML = `Icy: ${icy}`;
        reviewCard.querySelector(".comment").innerHTML = `Comments: ${comment}`;

        ``

        // Populate the star rating based on the rating value

        // Initialize an empty string to store the star rating HTML
        // let starRating = "";
        // // This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
        // for (let i = 0; i < rating; i++) {
        //     starRating += '<span class="material-icons">star</span>';
        // }
        // // After the first loop, this second loop runs from i=rating to i<5.
        // for (let i = rating; i < 5; i++) {
        //     starRating += '<span class="material-icons">star_outline</span>';
        // }
        // reviewCard.querySelector(".star-rating").innerHTML = starRating;

        reviewCardGroup.appendChild(reviewCard);
      });
    });
}

function test() {
  console.log("Test")
  console.log(currentUser);
}

var currentUser;
//Function that calls everything needed for the main page  
// function doAll() {
//   firebase.auth().onAuthStateChanged(user => {
//     if (user) {
//       currentUser = db.collection("users").doc(user.uid); //global
//       console.log(currentUser);
//       populateReviews();
//     } else {
//       // No user is signed in.
//       console.log("No user is signed in");
//       window.location.href = "login.html";
//     }
//   });
// }
// // currentUser = db.collection("users").doc(user.uid); //global
// // console.log(currentUser);
// doAll();
populateReviews();
console.log(currentUser);
test()

// populateReviews();

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(hikeDocID) {

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid); //global
      console.log(currentUser);
      // Manage the backend process to store the hikeDocID in the database, recording which hike was bookmarked by the user.
      currentUser.update({
        // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
        // This method ensures that the ID is added only if it's not already present, preventing duplicates.
        bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeDocID)
      })
        // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
        .then(function () {
          console.log("bookmark has been saved for " + hikeDocID);
          var iconID = 'save-' + hikeDocID;
          //console.log(iconID);
          //this is to change the icon of the hike that was saved to "filled"
          document.getElementById(iconID).innerText = 'bookmark';
        });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
      window.location.href = "login.html";
    }
  });
  // // Manage the backend process to store the hikeDocID in the database, recording which hike was bookmarked by the user.
  // currentUser.update({
  //   // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
  //   // This method ensures that the ID is added only if it's not already present, preventing duplicates.
  //   bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeDocID)
  // })
  //   // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
  //   .then(function () {
  //     console.log("bookmark has been saved for" + hikeDocID);
  //     var iconID = 'save-' + hikeDocID;
  //     //console.log(iconID);
  //     //this is to change the icon of the hike that was saved to "filled"
  //     document.getElementById(iconID).innerText = 'bookmark';
  //   });
}

let params = new URL(window.location.href); // Get the URL from the search bar
let locationID = params.searchParams.get("id");
console.log(locationID)
document.querySelector('i').id = 'save-' + locationID;   //guaranteed to be unique
document.querySelector('i').onclick = () => saveBookmark(locationID);
// document.querySelector('i').onclick = () => console.log(locationID);

