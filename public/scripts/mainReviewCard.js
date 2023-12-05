var currentUser;

function doAll() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid); //global
      console.log(currentUser);
      getLocation(user);
    } else {
      // No user is signed in.
      console.log("No user is signed in");
      window.location.href = "login.html";
    }
  });
}

function getLocation(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      console.log(userDoc.data().mainLocation);
      var mainCardLocation = userDoc.data().mainLocation;
      searchForLocationName(mainCardLocation);
      populateReviews(mainCardLocation);
    });
}

function searchForLocationName(mainCardLocation) {

  db.collection("searches")
  .doc(mainCardLocation)
  .get()
  .then(doc => {
    var title = doc.data().name; // get value of the "name" key
    console.log(title);
    document.querySelector(".title").innerHTML = title;
  },
)}



function populateReviews(locationID) {
  let reviewCardTemplate = document.getElementById("card-template");
  let reviewCardGroup = document.getElementById("reviewCardGroup");

  console.log(locationID);
  // Double-check: is your collection called "Reviews" or "reviews"?
  db.collection("reviews")
    .where("locationID", "==", locationID)
    .orderBy("timestamp", "desc")
    .get()
    .then((allReviews) => {
      const reviews = allReviews.docs;
      if (reviews.length > 0) {
        const doc = reviews[0];
        var condition = doc.data().condition;
        console.log(condition);
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
      }
    });
}

doAll();