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

//Global variable pointing to the current user's Firestore document
var currentUser;

//Function that calls everything needed for the main page  
function doAll() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid); //global
      console.log(currentUser);

      // the following functions are always called when someone is logged in
      populateReviews();
      keepBookmark();
    } else {
      // No user is signed in.
      console.log("No user is signed in");
      window.location.href = "login.html";
    }
  });
}
doAll();

// code for populating the reviews onto the page - TO BE UPDATED

function populateReviews() {
  let reviewCardTemplate = document.getElementById("card-template");
  let reviewCardGroup = document.getElementById("reviewCardGroup");

  let params = new URL(window.location.href); // Get the URL from the search bar
  let locationID = params.searchParams.get("id");
  console.log(locationID)
  // Double-check: is your collection called "Reviews" or "reviews"?
  db.collection("reviews")
    .where("locationID", "==", locationID)
    .orderBy("timestamp", "desc")
    .get()
    .then((allReviews) => {
      reviews = allReviews.docs;
      const latestReviews = reviews.slice(0, 4); // Get the latest three reviews
      const oldReviews = reviews.slice(4); // Get the rest of the reviews

      latestReviews.forEach((doc) => {
        var condition = doc.data().condition;
        var icy = doc.data().icy;
        // var docID = doc.id;
        console.log("hello");
        var comment = doc.data().comment;
        var time = doc.data().timestamp.toDate();

        console.log(time);

        let reviewCard = reviewCardTemplate.content.cloneNode(true);
        reviewCard.querySelector(".condition").innerHTML = `Condition: <b>${condition}</b>`;
        reviewCard.querySelector(".time").innerHTML = new Date(time).toLocaleString();
        reviewCard.querySelector(".icy").innerHTML = `Icy: ${icy}`;
        reviewCard.querySelector(".comment").innerHTML = `Comments: ${comment}`;

        reviewCardGroup.appendChild(reviewCard);
      });
      // Delete the rest of the reviews
      oldReviews.forEach((doc) => {
        doc.ref.delete();
      });
    })


}



// populateReviews();

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(locationDocID) {
  currentUser.get().then(userDoc => {
    let bookmarks = userDoc.data().bookmarks;
    let iconID = 'save-' + locationDocID;
    let isBookmarked = bookmarks.includes(locationDocID);

    if (isBookmarked) {
      // Remove bookmark
      currentUser.update({
        bookmarks: firebase.firestore.FieldValue.arrayRemove(locationDocID)
      }).then(() => {
        console.log("Bookmark removed for " + locationDocID);
        document.getElementById(iconID).innerText = 'bookmark_border';
      });
    } else {
      // Add bookmark
      currentUser.update({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(locationDocID)
      }).then(() => {
        console.log("Bookmark added for " + locationDocID);
        document.getElementById(iconID).innerText = 'bookmark';
      });
    }
  });
}

let params = new URL(window.location.href); // Get the URL from the search bar
let locationID = params.searchParams.get("id");
console.log(locationID)
document.querySelector('i').id = 'save-' + locationID;   //guaranteed to be unique
document.querySelector('i').onclick = () => saveBookmark(locationID);
// document.querySelector('i').onclick = () => console.log(locationID);

function keepBookmark() {
  currentUser.get().then(userDoc => {
    //get the user name
    var bookmarks = userDoc.data().bookmarks;
    console.log(bookmarks);
    console.log(locationID);
    if (bookmarks.includes(locationID)) {
      document.getElementById('save-' + locationID).innerText = 'bookmark';
    } else {
      document.getElementById('save-' + locationID).innerText = 'bookmark_border';
    }
  })
}



// Function to redirect to a new URL with location info
function redirectToNewURL() {
  // Get the query string from the current URL
  var queryString = window.location.search;

  // Parse the query string to extract the id parameter
  var urlParams = new URLSearchParams(queryString);
  var id = urlParams.get('id');
  var locationName = urlParams.get('locationName');
  var city = urlParams.get('city');
  var province = urlParams.get('province');

  // Construct the new URL with the extracted id parameter
  var newUrl = '../../app/html/locationPhotos.html?id=' + id + '&locationName=' + locationName + '&city=' + city + '&province=' + province;

  // Redirect to the new URL on the same page
  window.location.href = newUrl;
}

// Add event listener to the "photos" button
document.getElementById("photos").addEventListener("click", redirectToNewURL);

