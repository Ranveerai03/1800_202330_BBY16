// console.log(db.collection('searches'));
// console.log(db.collection('searches').get(ywwzV8QsjT5rbQYyadp7));

// document.querySelector("#test").addEventListener("click", function (e) {
    
//     function getQueryParam(name) {
//         const urlParams = new URLSearchParams(window.location.search);
//         return urlParams.get(name);
//       }
    
//       // Retrieve the location name from the URL
//       const locationName = getQueryParam('locationName');
    
//       // Display the location name on the page
//       const locationNameElement = document.getElementById('name-goes-here');
//       if (locationName) {
//         locationNameElement.textContent = `${decodeURIComponent(locationName)}`;
//       } else {
//         locationNameElement.textContent = 'Location not found';
//       }
    
//       // Retrieve the city name from the URL
//       const city = getQueryParam('city');
    
//       // Display the location name on the page
//       const cityElement = document.getElementById('city-goes-here');
//       if (city) {
//         cityElement.textContent = `${decodeURIComponent(city)}` + ',';
//       } else {
//         cityElement.textContent = 'Location not found';
//       }
    
//         // Retrieve the location name from the URL
//         const province = getQueryParam('province');
    
//         // Display the location name on the page
//         const provinceElement = document.getElementById('province-goes-here');
//         if (province) {
//           provinceElement.textContent = `${decodeURIComponent(province)}`;
//         } else {
//           provinceElement.textContent = 'Location not found';
//         }
//     ``
// });

db.collection('searches').get().then(allSearches => {
    const features = []; // Defines an empty array for information to be added to

    allSearches.forEach(doc => {
      lat = doc.data().lat;
      lng = doc.data().lng;
      // console.log(doc);
      // console.log(lat, lng);
      coordinates = [lng, lat];
      // console.log(coordinates);
      // Coordinates
      event_name = doc.data().name; // Event Name
      preview = doc.data().details; // Text Preview
      // img = doc.data().posterurl; // Image
      // url = doc.data().link; // URL
    })})

    // console.log(db.collection('searches').where('ywwzV8QsjT5rbQYyadp7').get())