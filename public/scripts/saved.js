// // console.log(db.collection('searches'));
// // console.log(db.collection('searches').get(ywwzV8QsjT5rbQYyadp7));

// // document.querySelector("#test").addEventListener("click", function (e) {
    
// //     function getQueryParam(name) {
// //         const urlParams = new URLSearchParams(window.location.search);
// //         return urlParams.get(name);
// //       }
    
// //       // Retrieve the location name from the URL
// //       const locationName = getQueryParam('locationName');
    
// //       // Display the location name on the page
// //       const locationNameElement = document.getElementById('name-goes-here');
// //       if (locationName) {
// //         locationNameElement.textContent = `${decodeURIComponent(locationName)}`;
// //       } else {
// //         locationNameElement.textContent = 'Location not found';
// //       }
    
// //       // Retrieve the city name from the URL
// //       const city = getQueryParam('city');
    
// //       // Display the location name on the page
// //       const cityElement = document.getElementById('city-goes-here');
// //       if (city) {
// //         cityElement.textContent = `${decodeURIComponent(city)}` + ',';
// //       } else {
// //         cityElement.textContent = 'Location not found';
// //       }
    
// //         // Retrieve the location name from the URL
// //         const province = getQueryParam('province');
    
// //         // Display the location name on the page
// //         const provinceElement = document.getElementById('province-goes-here');
// //         if (province) {
// //           provinceElement.textContent = `${decodeURIComponent(province)}`;
// //         } else {
// //           provinceElement.textContent = 'Location not found';
// //         }
// //     ``
// // });

// db.collection('searches').get().then(allSearches => {
//     const features = []; // Defines an empty array for information to be added to

//     allSearches.forEach(doc => {
//       lat = doc.data().lat;
//       lng = doc.data().lng;
//       // console.log(doc);
//       // console.log(lat, lng);
//       coordinates = [lng, lat];
//       // console.log(coordinates);
//       // Coordinates
//       event_name = doc.data().name; // Event Name
//       preview = doc.data().details; // Text Preview
//       // img = doc.data().posterurl; // Image
//       // url = doc.data().link; // URL
//     })})

//     // console.log(db.collection('searches').where('ywwzV8QsjT5rbQYyadp7').get())

document.getElementById("add").onclick = function(){
  location.href = "../../app/html/map.html"
}

//----------------------------------------------------------
// This function is the only function that's called.
// This strategy gives us better control of the page.
//----------------------------------------------------------
function doAll() {
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
          getBookmarks(user)
      } else {
          console.log("No user is signed in");
      }
  });
}
doAll();



//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks) 
// and dynamically displays them in the gallery
//----------------------------------------------------------
function getBookmarks(user) {
  db.collection("users").doc(user.uid).get()
      .then(userDoc => {

          // Get the Array of bookmarks
          var bookmarks = userDoc.data().bookmarks;
          console.log(bookmarks);
          
          // Get pointer the new card template
          let newcardTemplate = document.getElementById("savedCardTemplate");

          // Iterate through the ARRAY of bookmarked hikes (document ID's)
          bookmarks.forEach(thisLocationID => {
              console.log(thisLocationID);
              db.collection("searches").doc(thisLocationID).get().then(doc => {
                  var title = doc.data().name; // get value of the "name" key
                  var locationCode = doc.data().code; //get unique ID to each hike to be used for fetching right image
                  var city = doc.data().city; //gets the length field
                  var ts = doc.data().last_updated.toDate();
                  var time = new Date(ts).toLocaleString(); 
                  var docID = doc.id;  //this is the autogenerated ID of the document
                  console.log(docID);
                  
                  //clone the new card
                  let newcard = newcardTemplate.content.cloneNode(true);

                  //update title and some pertinant information
                  newcard.querySelector('.card-title').innerHTML = title;
                  newcard.querySelector('.card-city').innerHTML = city;
                  newcard.querySelector('.route-timestamp').innerHTML = "Last Updated: " + time;

                  newcard.querySelector('a').href = "locationReviews.html?id=" + doc.id + "&locationName=" + title + "&city=" + city + "&province=" + doc.data().province + "";

                  // //NEW LINE: update to display length, duration, last updated
                  // newcard.querySelector('.card-length').innerHTML =
                  //     "Length: " + doc.data().length + " km <br>" +
                  //     "Duration: " + doc.data().hike_time + "min <br>" +
                  //     "Last updated: " + doc.data().last_updated.toDate().toLocaleDateString();

                  //Finally, attach this new card to the gallery
                  hikeCardGroup.appendChild(newcard);
                //   document.getElementById("temp").onclick = function(){
                //     // location.href = "../../app/html/main.html"
                //     console.log(docID);
                // }

                function test(){
                  
                }
              })
          });
        //   document.getElementById("temp").onclick = function(){
        //     // location.href = "../../app/html/main.html"
        //     console.log("helo");
        // }
      })
}

