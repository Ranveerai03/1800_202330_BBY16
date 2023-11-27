function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  // console.log(urlParams);
  return urlParams.get(name);
}

// Retrieve the location name from the URL
const locationName = getQueryParam('locationName');
console.log(locationName, 'location name')

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

// Retrieve the locationID from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const locationID = urlParams.get('id');

// Access Firestore and query the 'photos' collection
const photosRef = db.collection('photos');

// Select the element where you want to display the images
const imagesContainer = document.getElementById('images-container');

// Function to format the timestamp to date and time format
function formatTimestamp(last_updated) {
  const { seconds, nanoseconds } = last_updated;
  const date = new Date(seconds * 1000 + nanoseconds / 1000000); // Convert to milliseconds
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return date.toLocaleString('en-US', options);
}

// Query to find all photos with the matching locationID
photosRef.where('locationID', '==', locationID)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // Retrieve the link from each document data
      const photoData = doc.data();
      const imageLink = photoData.image;
      const lastUpdated = photoData.last_updated;

      console.log(lastUpdated, "time working?")

      // Create an image element for each retrieved image
      const imgElement = document.createElement('img');
      imgElement.src = imageLink;
      imgElement.alt = 'Image';

      // Create a text element for the timestamp
      const timestampElement = document.createElement('p');
      const formattedTimestamp = formatTimestamp(lastUpdated);
      timestampElement.textContent = `Last Updated: ${formattedTimestamp}`;

      // Append each image element and timestamp to the images container
      imagesContainer.appendChild(imgElement);
      imagesContainer.appendChild(timestampElement);

    });
  })
  .catch((error) => {
    console.error('Error getting documents: ', error);
  });

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
  var newUrl = '../../app/html/locationReviews.html?id=' + id + '&locationName=' + locationName + '&city=' + city + '&province=' + province;

  // Redirect to the new URL on the same page
  window.location.href = newUrl;
}

// Add event listener to the "photos" button
document.getElementById("reviews").addEventListener("click", redirectToNewURL);





