var currentUser;

function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      getLocation(user);
    } else {
      window.location.href = "login.html";
    }
  });
}

function getLocation(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      var mainCardLocation = userDoc.data().mainLocation;
      searchForLocationName(mainCardLocation);
      populateReviews(mainCardLocation);
    });
}

function searchForLocationName(mainCardLocation) {
  db.collection("searches")
    .doc(mainCardLocation)
    .get()
    .then((doc) => {
      var title = doc.data().name;
      document.querySelector(".title").innerHTML = title;
    });
}

function populateReviews(locationID) {
  let reviewCardTemplate = document.getElementById("card-template");
  let reviewCardGroup = document.getElementById("reviewCardGroup");

  db.collection("reviews")
    .where("locationID", "==", locationID)
    .orderBy("timestamp", "desc")
    .get()
    .then((allReviews) => {
      const reviews = allReviews.docs;
      if (reviews.length > 0) {
        const doc = reviews[0];
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
      }
    });
}

doAll();
