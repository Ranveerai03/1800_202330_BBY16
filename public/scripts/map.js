mapboxgl.accessToken = 'pk.eyJ1IjoiY3BhbmczMSIsImEiOiJjbG90YmNvaGIwNzl1MmttbXE3OXZrcXhjIn0.0YNHOnKn9XhDmxrzmzVrjA';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: [-123.000956, 49.249599], // starting position [lng, lat]
  zoom: 9 // starting zoom
});

// const locations = [
//     {
//         name: 'BCIT',
//         // color: '#8cc2e3',
//         lngLat: [-123.000956, 49.249599]
//     },
//     {
//         name: 'Metropolis at Metrotown',
//         // color: '#8cc2e3',
//         lngLat: [-122.999604, 49.226637]
//     }
// ]

// locations.forEach(({ name, lngLat }) => {
//     // create the popup
//     const popup = new mapboxgl.Popup({ offset: 25 }).setText(name);
//     // Create a default Marker and add it to the map.
//     const marker = new mapboxgl.Marker({
//         color: '#8cc2e3',
//         scale: 1
//     })
//         .setLngLat(lngLat) //lng, lat
//         .setPopup(popup) // sets a popup on this marker
//         .addTo(map);

// })

// // create the popup
// const popup = new mapboxgl.Popup({ offset: 25 }).setText(
//     'Construction on the Washington Monument began in 1848.'
// );

// // Create a default Marker and add it to the map.
// // adding marker to Deer Lake Park
// const marker1 = new mapboxgl.Marker({
//     color: '#8cc2e3',
//     scale: 0.6
// })
//     .setLngLat([-122.975721, 49.235198]) //lng, lat
//     .setPopup(popup) // sets a popup on this marker
//     .addTo(map);

// map.on('load', () => {
//     map.setFog({});
// })

function showMap() {

  //------------------------------------
  // Listen for when map finishes loading
  // then Add map features 
  //------------------------------------
  map.on('load', () => {

    // Add the control to the map.
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );

    // Add geolocate control to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      })
    );

    // Add user controls to map
    map.addControl(new mapboxgl.NavigationControl());

    // Defines map pin icon for events
    map.loadImage(
      'https://cdn.iconscout.com/icon/free/png-256/pin-locate-marker-location-navigation-16-28668.png',
      (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.addImage('eventpin', image); // Pin Icon

        // READING information from "searches" collection in Firestore
        db.collection('searches').get().then(allSearches => {
          const features = []; // Defines an empty array for information to be added to

          allSearches.forEach(doc => {
            lat = doc.data().lat;
            lng = doc.data().lng;
            console.log(lat, lng);
            coordinates = [lng, lat];
            console.log(coordinates);
            // Coordinates
            event_name = doc.data().name; // Event Name
            preview = doc.data().details; // Text Preview
            // img = doc.data().posterurl; // Image
            // url = doc.data().link; // URL

            // Pushes information into the features array
            // in our application, we have a string description of the hike
            features.push({
              'type': 'Feature',
              'properties': {
                'description': `<strong>${event_name}</strong><p>${preview}</p> <br> 
                <a href="locationReviews.html?id=${doc.id}&locationName=${event_name}&city=${doc.data().city}&province=${doc.data().province}" 
                title="Get info about location">Read more</a>`
              },
              'geometry': {
                'type': 'Point',
                'coordinates': coordinates
              }
            });
          });

          // Adds features as a source of data for the map
          map.addSource('places', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': features
            }
          });

          // Creates a layer above the map displaying the pins
          // by using the sources that was just added
          map.addLayer({
            'id': 'places',
            'type': 'symbol',
            // source: 'places',
            'source': 'places',
            'layout': {
              'icon-image': 'eventpin', // Pin Icon
              'icon-size': 0.1, // Pin Size
              'icon-allow-overlap': true // Allows icons to overlap
            }
          });

          //-----------------------------------------------------------------------
          // Add Click event listener, and handler function that creates a popup
          // that displays info from "searches" collection in Firestore
          //-----------------------------------------------------------------------
          map.on('click', 'places', (e) => {
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
          map.on('mouseenter', 'places', () => {
            map.getCanvas().style.cursor = 'pointer';
          });

          // Defaults cursor when not hovering over the places layer
          map.on('mouseleave', 'places', () => {
            map.getCanvas().style.cursor = '';
          });
        });
      }
    );

    // // Add the image to the map style.
    // map.loadImage(
    //     'https://cdn-icons-png.flaticon.com/512/61/61168.png',
    //     (error, image) => {
    //         if (error) throw error;

    //         // // Add the image to the map style with width and height values
    //         // map.addImage('userpin', image, { width: 10, height: 10 });

    //         // Adds user's current location as a source to the map
    //         navigator.geolocation.getCurrentPosition(position => {
    //             const userLocation = [position.coords.longitude, position.coords.latitude];
    //             console.log(userLocation);
    //             if (userLocation) {
    //                 map.addSource('userLocation', {
    //                     'type': 'geojson',
    //                     'data': {
    //                         'type': 'FeatureCollection',
    //                         'features': [{
    //                             'type': 'Feature',
    //                             'geometry': {
    //                                 'type': 'Point',
    //                                 'coordinates': userLocation
    //                             },
    //                             'properties': {
    //                                 'description': 'Your location'
    //                             }
    //                         }]
    //                     }
    //                 });

    //                 // Creates a layer above the map displaying the user's location
    //                 map.addLayer({
    //                     'id': 'userLocation',
    //                     'type': 'symbol',
    //                     'source': 'userLocation',
    //                     'layout': {
    //                         'icon-image': 'userpin', // Pin Icon
    //                         'icon-size': 0.05, // Pin Size
    //                         'icon-allow-overlap': true // Allows icons to overlap
    //                     }
    //                 });

    //                 // Map On Click function that creates a popup displaying the user's location
    //                 map.on('click', 'userLocation', (e) => {
    //                     // Copy coordinates array.
    //                     const coordinates = e.features[0].geometry.coordinates.slice();
    //                     const description = e.features[0].properties.description;

    //                     new mapboxgl.Popup()
    //                         .setLngLat(coordinates)
    //                         .setHTML(description)
    //                         .addTo(map);
    //                 });

    //                 // Change the cursor to a pointer when the mouse is over the userLocation layer.
    //                 map.on('mouseenter', 'userLocation', () => {
    //                     map.getCanvas().style.cursor = 'pointer';
    //                 });

    //                 // Defaults
    //                 // Defaults cursor when not hovering over the userLocation layer
    //                 map.on('mouseleave', 'userLocation', () => {
    //                     map.getCanvas().style.cursor = '';
    //                 });
    //             }
    //         });
    //     }
    // );
  });
}

// Call the function to display the map with the user's location and event pins
showMap();
