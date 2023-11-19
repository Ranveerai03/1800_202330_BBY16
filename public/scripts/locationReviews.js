function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Retrieve the location name from the URL
  const locationName = getQueryParam('locationName');

  // Display the location name on the page
  const locationNameElement = document.getElementById('name-goes-here');
  if (locationName) {
    locationNameElement.textContent = `${decodeURIComponent(locationName)}`;
  } else {
    locationNameElement.textContent = 'Location not found';
  }

