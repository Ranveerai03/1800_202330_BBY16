function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const locationName = getQueryParam("locationName");

const locationNameElement = document.getElementById("name-goes-here");
if (locationName) {
  locationNameElement.textContent = `${decodeURIComponent(locationName)}`;
} else {
  locationNameElement.textContent = "Location not found";
}

const city = getQueryParam("city");

const cityElement = document.getElementById("city-goes-here");
if (city) {
  cityElement.textContent = `${decodeURIComponent(city)}` + ",";
} else {
  cityElement.textContent = "Location not found";
}

const province = getQueryParam("province");

const provinceElement = document.getElementById("province-goes-here");
if (province) {
  provinceElement.textContent = `${decodeURIComponent(province)}`;
} else {
  provinceElement.textContent = "Location not found";
}

var currentUser;

function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid); //global
      populateReviews();
      keepBookmark();
    } else {
      window.location.href = "login.html";
    }
  });
}
doAll();

function populateReviews() {
  let reviewCardTemplate = document.getElementById("card-template");
  let reviewCardGroup = document.getElementById("reviewCardGroup");

  let params = new URL(window.location.href);
  let locationID = params.searchParams.get("id");
  db.collection("reviews")
    .where("locationID", "==", locationID)
    .orderBy("timestamp", "desc")
    .get()
    .then((allReviews) => {
      reviews = allReviews.docs;
      const latestReviews = reviews.slice(0, 4);
      const oldReviews = reviews.slice(4);

      latestReviews.forEach((doc) => {
        var condition = doc.data().condition;
        var icy = doc.data().icy;
        var comment = doc.data().comment;
        var time = doc.data().timestamp.toDate();

        let reviewCard = reviewCardTemplate.content.cloneNode(true);
        reviewCard.querySelector(
          ".condition"
        ).innerHTML = `Condition: <b>${condition}</b>`;
        reviewCard.querySelector(".time").innerHTML = new Date(
          time
        ).toLocaleString();
        reviewCard.querySelector(".icy").innerHTML = `Icy: ${icy}`;
        reviewCard.querySelector(".comment").innerHTML = `Comments: ${comment}`;

        reviewCardGroup.appendChild(reviewCard);
      });
      oldReviews.forEach((doc) => {
        doc.ref.delete();
      });
    });
}

function saveBookmark(locationDocID) {
  currentUser.get().then((userDoc) => {
    let bookmarks = userDoc.data().bookmarks;
    let iconID = "save-" + locationDocID;
    let isBookmarked = bookmarks.includes(locationDocID);

    if (isBookmarked) {
      currentUser
        .update({
          bookmarks: firebase.firestore.FieldValue.arrayRemove(locationDocID),
        })
        .then(() => {
          document.getElementById(iconID).innerText = "bookmark_border";
        });
    } else {
      currentUser
        .update({
          bookmarks: firebase.firestore.FieldValue.arrayUnion(locationDocID),
        })
        .then(() => {
          document.getElementById(iconID).innerText = "bookmark";
        });
    }
  });
}

let params = new URL(window.location.href);
let locationID = params.searchParams.get("id");
document.querySelector("i").id = "save-" + locationID;
document.querySelector("i").onclick = () => saveBookmark(locationID);

function keepBookmark() {
  currentUser.get().then((userDoc) => {
    var bookmarks = userDoc.data().bookmarks;
    if (bookmarks.includes(locationID)) {
      document.getElementById("save-" + locationID).innerText = "bookmark";
    } else {
      document.getElementById("save-" + locationID).innerText =
        "bookmark_border";
    }
  });
}

function redirectToNewURL() {
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var id = urlParams.get("id");
  var locationName = urlParams.get("locationName");
  var city = urlParams.get("city");
  var province = urlParams.get("province");
  var newUrl =
    "../../app/html/locationPhotos.html?id=" +
    id +
    "&locationName=" +
    locationName +
    "&city=" +
    city +
    "&province=" +
    province;

  window.location.href = newUrl;
}

document.getElementById("photos").addEventListener("click", redirectToNewURL);
