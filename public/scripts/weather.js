//-----------------------------------------------------------------------
// Define the weather object with methods to fetch and display weather data.
//-----------------------------------------------------------------------
let weather = {
<<<<<<< HEAD
  apiKey: "5581b3fe3c38f9aa0272406a1c3e1f46",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerHTML = description;
    document.querySelector(".temp").innerHTML = temp + "°C";
    document.querySelector(".humidity").innerHTML =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerHTML =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
=======
  // API key to authenticate with the weather service.
  "apiKey": "5581b3fe3c38f9aa0272406a1c3e1f46",
   // fetchWeather: Retrieves weather data for a specific city using the OpenWeatherMap API.
  fetchWeather: function (city){
    // Construct the URL with the city name and API key, and make an API request.  
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
    // Parse the JSON response.  
    .then((response) => response.json())
    // Pass the data to the displayWeather function.
    .then((data) => this.displayWeather(data));
  },
  // displayWeather: Updates the webpage with the weather data received from the API.
  displayWeather: function(data){
      // Extract relevant properties from the data object.
      const {name} = data;
      const {icon, description} = data.weather[0];
      const {temp, humidity} = data.main;
      const {speed} = data.wind;
      // Update the DOM elements with the new weather data.
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerHTML = description;
      document.querySelector(".temp").innerHTML = temp + "°C";
      document.querySelector(".humidity").innerHTML = "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerHTML = "Wind speed: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
  },
  // search: Triggered by the search operation in the UI to initiate a weather data fetch.
  search: function () {
      // Call fetchWeather with the value from the search bar input.
      this.fetchWeather(document.querySelector(".search-bar").value);
  }
>>>>>>> 07084a73afdcb770ceefa057bdcd61a9bf4e584d
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

var currentUser;
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUser = db.collection("users").doc(user.uid);
    insertNameFromFirestore(user);
  } else {
    console.log("No user logged in");
  }
});

var location;
function insertNameFromFirestore(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      console.log(userDoc.data().weatherLocation);
      weather.fetchWeather(userDoc.data().weatherLocation);
    });
}
