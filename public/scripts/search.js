function writeSearches() {
  //define a variable for the collection you want to create in Firestore to populate data
  var searchesRef = db.collection("searches");

  searchesRef.add({
    code: "BBY01",
    name: "BCIT", //replace with your own city?
    city: "Burnaby",
    province: "BC",
    details: "Snow condition",
    search_time: 10, //number value
    lat: 49.2467097082573,
    lng: -122.9187029619698,
    last_updated: firebase.firestore.FieldValue.serverTimestamp(), //current system time
  });
  searchesRef.add({
    code: "BBY02",
    name: "Metropolis at Metrotown", //replace with your own city?
    city: "Anmore",
    province: "BC",
    details: "Snow condition",
    search_time: 20, //number value
    lat: 49.3399431028579,
    lng: -122.85908496766939,
    last_updated: firebase.firestore.FieldValue.serverTimestamp(), //current system time
  });
  searchesRef.add({
    code: "BBY03",
    name: "Deer Lake Park", //replace with your own city?
    city: "Burnaby",
    province: "BC",
    details: "Snow Condition",
    search_time: 12, //number value
    lat: 49.38847101455571,
    lng: -122.94092543551031,
    last_updated: firebase.firestore.FieldValue.serverTimestamp(), //current system time
  });
}
//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("searchCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable.

  db.collection(collection)
    .get() //the collection called "hikes"
    .then((allSearches) => {
      //var i = 1;  //Optional: if you want to have a unique ID for each hike
      allSearches.forEach((doc) => {
        //iterate thru each doc
        var title = doc.data().name; // get value of the "name" key
        var details = doc.data().details; // get value of the "details" key
        var searchCode = doc.data().code; //get unique ID to each hike to be used for fetching right image
        var docID = doc.id;
        let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

        //update title and text and image
        newcard.querySelector(".card-title").innerHTML = title;
        newcard.querySelector(".card-text").innerHTML = details;
        newcard.querySelector(
          ".card-image"
        ).src = `../images/${searchCode}.jpg`; //Example: NV01.jpg
        // newcard.querySelector('a').href = "eachSearch.html?docID="+docID;

        //Optional: give unique ids to all elements for future use
        // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
        // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
        // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

        //attach to gallery, Example: "hikes-go-here"
        document.getElementById(collection + "-go-here").appendChild(newcard);

        //i++;   //Optional: iterate variable to serve as unique ID
      });
    });
}

displayCardsDynamically("searches"); //input param is the name of the collection
