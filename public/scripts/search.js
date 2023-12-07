function writeSearches() {
  var searchesRef = db.collection("searches");

  searchesRef.add({
    code: "BBY01",
    name: "BCIT",
    city: "Burnaby",
    province: "BC",
    details: "Snow condition",
    search_time: 10,
    lat: 49.2467097082573,
    lng: -122.9187029619698,
    last_updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
  searchesRef.add({
    code: "BBY02",
    name: "Metropolis at Metrotown",
    city: "Anmore",
    province: "BC",
    details: "Snow condition",
    search_time: 20,
    lat: 49.3399431028579,
    lng: -122.85908496766939,
    last_updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
  searchesRef.add({
    code: "BBY03",
    name: "Deer Lake Park",
    city: "Burnaby",
    province: "BC",
    details: "Snow Condition",
    search_time: 12,
    lat: 49.38847101455571,
    lng: -122.94092543551031,
    last_updated: firebase.firestore.FieldValue.serverTimestamp(),
  });
}
//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("searchCardTemplate");

  db.collection(collection)
    .get()
    .then((allSearches) => {
      allSearches.forEach((doc) => {
        var title = doc.data().name;
        var details = doc.data().details;
        var searchCode = doc.data().code;
        var docID = doc.id;
        let newcard = cardTemplate.content.cloneNode(true);
        newcard.querySelector(".card-title").innerHTML = title;
        newcard.querySelector(".card-text").innerHTML = details;
        newcard.querySelector(
          ".card-image"
        ).src = `../images/${searchCode}.jpg`;
        document.getElementById(collection + "-go-here").appendChild(newcard);
      });
    });
}

displayCardsDynamically("searches");
