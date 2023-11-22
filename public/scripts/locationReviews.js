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

// code for populating the reviews onto the page - TO BE UPDATED

function populateReviews() {
  let reviewCardTemplate = document.getElementById("card-template");
  let reviewCardGroup = document.getElementById("reviewCardGroup");

  let params = new URL(window.location.href); // Get the URL from the search bar
  let locationID = params.searchParams.get("id");
  console.log(locationID)
  // Double-check: is your collection called "Reviews" or "reviews"?
  db.collection("reviews")
      .where("locationID", "==", locationID)
      .get()
      .then((allReviews) => {
          reviews = allReviews.docs;
          reviews.forEach((doc) => {
              var condition = doc.data().condition;
              var icy = doc.data().icy;
              var comment = doc.data().comment;
              var time = doc.data().timestamp.toDate();

              console.log(time);

              let reviewCard = reviewCardTemplate.content.cloneNode(true);
              reviewCard.querySelector(".condition").innerHTML = condition;
              reviewCard.querySelector(".time").innerHTML = new Date(
                  time
              ).toLocaleString();
              reviewCard.querySelector(".icy").innerHTML = `Icy?: ${icy}`;
              reviewCard.querySelector(".comment").innerHTML = `Comments: ${comment}`;

              // Populate the star rating based on the rating value
              
              // Initialize an empty string to store the star rating HTML
              // let starRating = "";
              // // This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
              // for (let i = 0; i < rating; i++) {
              //     starRating += '<span class="material-icons">star</span>';
              // }
              // // After the first loop, this second loop runs from i=rating to i<5.
              // for (let i = rating; i < 5; i++) {
              //     starRating += '<span class="material-icons">star_outline</span>';
              // }
              // reviewCard.querySelector(".star-rating").innerHTML = starRating;

              reviewCardGroup.appendChild(reviewCard);
          });
      });
}

populateReviews();


