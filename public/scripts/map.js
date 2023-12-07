mapboxgl.accessToken =
  "pk.eyJ1IjoicmFudmVlcjAzIiwiYSI6ImNsb3N5bmphYzA0NWwyanBmdDBiNjUwZmMifQ.Y-xCIIe9Z3P01XkGo8p36g";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/ranveer03/clpovqe9n00c901op2x274nox",
  center: [-123.000956, 49.249599],
  zoom: 9,
});

function showMap() {
  map.on("load", () => {
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      })
    );
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
                <a href="locationReviews.html?id=${doc.id
                    }&locationName=${event_name}&city=${doc.data().city}&province=${doc.data().province
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
            map.on("click", "places", (e) => {
              const coordinates = e.features[0].geometry.coordinates.slice();
              const description = e.features[0].properties.description;
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
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

function fetchRoadClosures() {
  return fetch(
    "https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/road-ahead-current-road-closures/records?limit=20&refine=comp_date%3A%222023%2F12%22"
  )
    .then((response) => response.json())
    .then((data) => data.results)
    .catch((error) => console.error("Error fetching road closures:", error));
}

function createRoadClosureFeatures(roadClosures) {
  return roadClosures.map((closure) => ({
    type: "Feature",
    geometry: closure.geom.geometry,
    properties: {
      project: closure.project || "N/A",
      location: closure.location || "N/A",
      comp_date:
        new Date(closure.comp_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) || "N/A",
      url_link: closure.url_link || "#",
    },
  }));
}

map.on("load", () => {
  fetchRoadClosures().then((roadClosures) => {
    const roadClosureFeatures = createRoadClosureFeatures(roadClosures);
    map.addSource("road-closures", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: roadClosureFeatures,
      },
    });
    map.addLayer({
      id: "road-closures-layer",
      type: "line",
      source: "road-closures",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#ff0000",
        "line-width": 6,
      },
    });

    map.on("click", "road-closures-layer", (e) => {
      if (e.features.length > 0) {
        const closure = e.features[0].properties;
        const coordinates = e.lngLat;
        const popupContent = `
          <div>
            <h3>Project: ${closure.project}</h3>
            <p><strong>Location:</strong> ${closure.location}</p>
            <p><strong>Completion Date:</strong> ${closure.comp_date}</p>
            <p><a href="${closure.url_link}" target="_blank">More Info</a></p>
          </div>
        `;
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(map);
      }
    });

    map.on("mouseenter", "road-closures-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "road-closures-layer", () => {
      map.getCanvas().style.cursor = "";
    });
  });
});

showMap();
