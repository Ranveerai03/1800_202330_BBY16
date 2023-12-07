mapboxgl.accessToken =
  "pk.eyJ1IjoicmFudmVlcjAzIiwiYSI6ImNsb3N5bmphYzA0NWwyanBmdDBiNjUwZmMifQ.Y-xCIIe9Z3P01XkGo8p36g";
const map = new mapboxgl.Map({
  container: "mapHP",
  style: "mapbox://styles/ranveer03/clpovqe9n00c901op2x274nox",
  center: [-123.000956, 49.249599],
  zoom: 9,
});

function showMap() {
  map.on("load", () => {
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );
    map.addControl(new mapboxgl.NavigationControl());
    map.loadImage(
      "https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png",
      (error, image) => {
        if (error) throw error;
        map.addImage("eventpin", image);

        db.collection("searches")
          .get()
          .then((allSearches) => {
            const features = [];

            allSearches.forEach((doc) => {
              lat = doc.data().lat;
              lng = doc.data().lng;
              coordinates = [lng, lat];
              event_name = doc.data().name;
              preview = doc.data().details;
              features.push({
                type: "Feature",
                properties: {
                  description: `<strong>${event_name}</strong><p>${preview}</p> <br> 
                <a href="locationReviews.html?id=${
                  doc.id
                }&locationName=${event_name}&city=${doc.data().city}&province=${
                    doc.data().province
                  }" 
                title="Get info about location">Read more</a>`,
                },
                geometry: {
                  type: "Point",
                  coordinates: coordinates,
                },
              });
            });
            map.addSource("places", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: features,
              },
            });
            map.addLayer({
              id: "places",
              type: "symbol",
              source: "places",
              layout: {
                "icon-image": "eventpin",
                "icon-size": 0.1,
                "icon-allow-overlap": true,
              },
            });
            map.on("mouseenter", "places", () => {
              map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", "places", () => {
              map.getCanvas().style.cursor = "";
            });
          });
      }
    );
  });
}

showMap();

document.getElementById("mapHP").onclick = function(){
  location.href = "../../app/html/map.html";
};
