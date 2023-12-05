let weather = {
    "apiKey": "5581b3fe3c38f9aa0272406a1c3e1f46",
    fetchWeather: function (city){
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data){
        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;
        // console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerHTML = description;
        document.querySelector(".temp").innerHTML = temp + "°C";
        document.querySelector(".humidity").innerHTML = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerHTML = "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

document.querySelector(".search button").addEventListener("click", function (){
        weather.search();
});


var currentUser;
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUser = db.collection("users").doc(user.uid);
    insertNameFromFirestore(user);
  } else {
    // Handle user not logged in
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
        // location = userDoc.data().weatherLocation;
        weather.fetchWeather(userDoc.data().weatherLocation);
      });
  }

// const docRef = db.collection("users").doc(test);

// docRef.get().then((doc) => {
//         const data = doc.data();
//         const weatherLocation = data.country;
//         console.log(weatherLocation);
// });



// weather.fetchWeather("Burnaby")

