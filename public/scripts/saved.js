document.getElementById("add").onclick = function () {
  location.href = "../../app/html/map.html";
};

//----------------------------------------------------------
// This function is the only function that's called.
// This strategy gives us better control of the page.
//----------------------------------------------------------
function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      getBookmarks(user);
    } else {
    }
  });
}
doAll();

function getBookmarks(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      // Get the Array of bookmarks
      var bookmarks = userDoc.data().bookmarks;

      // Get pointer the new card template
      let newcardTemplate = document.getElementById("savedCardTemplate");

      // Iterate through the ARRAY of bookmarked searches (document ID's)
      for (let i = bookmarks.length - 1; i >= 0; i--) {
        const thisLocationID = bookmarks[i];
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

            //clone the new card
            let newcard = newcardTemplate.content.cloneNode(true);
            
            //update title and some pertinant information
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

            locationCardGroup.appendChild(newcard);
          });
      }
    });
}
