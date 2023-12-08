mapboxgl.accessToken =
  "pk.eyJ1IjoicmFudmVlcjAzIiwiYSI6ImNsb3N5bmphYzA0NWwyanBmdDBiNjUwZmMifQ.Y-xCIIe9Z3P01XkGo8p36g";
const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/ranveer03/clpovqe9n00c901op2x274nox",  // style URL
  center: [-123.000956, 49.249599], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

function showMap() {
  //------------------------------------
  // Listen for when map finishes loading
  // then Add map features
  //------------------------------------
  map.on("load", () => {
    // Add the control to the map.
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      })
    );
    // Add geolocate control to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );

    // Add user controls to map
    map.addControl(new mapboxgl.NavigationControl());

    // Defines map pin icon for events
    map.loadImage(
      "https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png",
      (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.addImage("eventpin", image); // Pin Icon

        // READING information from "searches" collection in Firestore
        db.collection("searches")
          .get()
          .then((allSearches) => {
            const features = []; // Defines an empty array for information to be added to
            allSearches.forEach((doc) => {
              lat = doc.data().lat;
              lng = doc.data().lng;
              coordinates = [lng, lat];
              // Coordinates
              event_name = doc.data().name; // Event Name
              preview = doc.data().details; // Text Preview
              
              // Pushes information into the features array
              // in our application, we have a string description of the hike
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

            // Adds features as a source of data for the map
            map.addSource("places", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: features,
              },
            });

            // Creates a layer above the map displaying the pins
            // by using the sources that was just added
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

            //-----------------------------------------------------------------------
            // Add Click event listener, and handler function that creates a popup
            // that displays info from "searches" collection in Firestore
            //-----------------------------------------------------------------------
            map.on("click", "places", (e) => {
              // Extract coordinates array.
              // Extract description of that place
              const coordinates = e.features[0].geometry.coordinates.slice();
              const description = e.features[0].properties.description;

              // Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
            });

            //-----------------------------------------------------------------------
            // Add mousenter event listener, and handler function to
            // Change the cursor to a pointer when the mouse is over the places layer.
            //-----------------------------------------------------------------------
            map.on("mouseenter", "places", () => {
              map.getCanvas().style.cursor = "pointer";
            });
            // Defaults cursor when not hovering over the places layer
            map.on("mouseleave", "places", () => {
              map.getCanvas().style.cursor = "";
            });
          });
      }
    );
  });
}

// Fetch road closure data
function fetchRoadClosures() {
  return fetch(
    "https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/road-ahead-current-road-closures/records?limit=20&refine=comp_date%3A%222023%2F12%22"
  )
    .then((response) => response.json())
    .then((data) => data.results)
    .catch((error) => console.error("Error fetching road closures:", error));
}

// Process road closure data
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

//------------------------------------
// Listen for when map finishes loading
// then Add map features
//------------------------------------
map.on("load", () => {
  // Fetch and process road closure data, then add it to the map
  fetchRoadClosures().then((roadClosures) => {
    const roadClosureFeatures = createRoadClosureFeatures(roadClosures);

    // Add the road closure data as a source
    map.addSource("road-closures", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: roadClosureFeatures,
      },
    });

    // Add a layer to display the road closures using red lines
    map.addLayer({
      id: "road-closures-layer",
      type: "line", // Use 'line' for LineString geometries
      source: "road-closures",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#ff0000", // Choose a color that stands out
        "line-width": 6,
      },
    });
    //-----------------------------------------------------------------------
    // Add Click event listener, and handler function that creates a popup
    // page displaying the location and completion date of the project
    //-----------------------------------------------------------------------
    map.on("click", "road-closures-layer", (e) => {
      // Check if a feature was clicked
      if (e.features.length > 0) {
        const closure = e.features[0].properties;
        const coordinates = e.lngLat;

        // HTML content for the popup
        const popupContent = `
          <div>
            <h3>Project: ${closure.project}</h3>
            <p><strong>Location:</strong> ${closure.location}</p>
            <p><strong>Completion Date:</strong> ${closure.comp_date}</p>
            <p><a href="${closure.url_link}" target="_blank">More Info</a></p>
          </div>
        `;

        // Create and show the popup
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(map);
      }
    });

    //-----------------------------------------------------------------------
    // Add mousenter event listener, and handler function to
    // Change the cursor to a pointer when the mouse is over the road closures layer.
    //-----------------------------------------------------------------------
    
    // Change the cursor to a pointer when the mouse is over the road closures layer.
    map.on("mouseenter", "road-closures-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Defaults cursor when not hovering over the road closures layer
    map.on("mouseleave", "road-closures-layer", () => {
      map.getCanvas().style.cursor = "";
    });
  });
});

// Call the function to display the map with the user's location and event pins
showMap();
