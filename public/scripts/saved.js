document.getElementById("add").onclick = function () {
  location.href = "../../app/html/map.html";
};
function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      getBookmarks(user);
    } else {
      console.log("No user is signed in");
    }
  });
}
doAll();

function getBookmarks(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      var bookmarks = userDoc.data().bookmarks;
      console.log(bookmarks);

      let newcardTemplate = document.getElementById("savedCardTemplate");

      for (let i = bookmarks.length - 1; i >= 0; i--) {
        const thisLocationID = bookmarks[i];
        console.log(thisLocationID);
        db.collection("searches")
          .doc(thisLocationID)
          .get()
          .then((doc) => {
            var docID = doc.id;
            var title = doc.data().name;
            var locationCode = doc.data().code;
            var city = doc.data().city;
            var ts = doc.data().last_updated.toDate();
            var time = new Date(ts).toLocaleString();
            console.log(time + "hahahaha");
            console.log(docID);
            let newcard = newcardTemplate.content.cloneNode(true);
            newcard.querySelector(".card-title").innerHTML = title;
            newcard.querySelector(".card-city").innerHTML = city;
            newcard.querySelector(".route-timestamp").innerHTML =
              "Last Updated: " + time;

            newcard.querySelector("a").href =
              "locationReviews.html?id=" +
              doc.id +
              "&locationName=" +
              title +
              "&city=" +
              city +
              "&province=" +
              doc.data().province +
              "";

            hikeCardGroup.appendChild(newcard);
          });
      }
    });
}
