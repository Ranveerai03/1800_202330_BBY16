# Project Title

## 1. Project Description

SnowGo is a web application to help Metro Vancouver commuters commute efficiently during the winter by submitting and viewing reviews on road conditions before starting their commute, unlike Google Maps, which only shows delays and accidents but not the weather conditions on the roads.

## 2. Names of Contributors

List team members and/or short bio's here...

- Hi, my name is Ranveer Rai. I am excited to work with my team in COMP 1800!
- Hi, my name is Chelsea Pang. I am excited for this project!
- Hi, my name is Elena Zhu, I am excited to work with our team!
- Hi, my name Jeremy Arciaga, I am excited to learn more as a team in tech!

## 3. Technologies and Resources Used

List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.

- HTML, CSS, JavaScript
- Bootstrap 5.0 (Frontend library)
- Firebase 8.0 (BAAS - Backend as a Service)
- Mapbox API
- Weather API
- City of Vancouver Road Closure API

## 4. Complete setup/installion/usage

State what a user needs to do when they come to your project. How do others start using your code or application?
Here are the steps ...

- Personalize the app to easily access information.
- Search for locations that the user wants travel to.
- Save the most-visited locations directly in the app.
- Read reviews from other users to get the latest insights on your destinations before you set out.

## 5. Known Bugs and Limitations

Here are some known bugs:

- Map Search Functionality: Users are currently unable to search for and save specific locations on the map.
- Seasonal Limitations: The app's features are heavily geared towards winter conditions.
- User-Generated Content: Our road condition updates depend on user submissions, which may not always reflect the most current situation.

## 6. Features for Future

What we'd like to build in the future:

- Introducing language options to cater to non-English-speaking users.
- Providing users with the ability to upload videos.
- Extending our coverage area to better serve a larger number of British Columbia residents.

## 7. Contents of Folder

Content of the project folder:

```
 Top level of project folder:
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to
├── html                     # Folder for html files
├── public                   # Folder for images, scripts, and styles
url
└── README.md                # woah, you're reading this now!

It has the following subfolders and files:
├── .git                     # Folder for git repo

├── /aboutUs.html            # About us HTML file, showing the app's story
    /add.html                # Add HTML file, the adding a post page
    /addPhoto.html           # Add photo HTML file, the adding a photo to a location page
    /addReview.html          # Add review HTML file, the adding a review to a location page
    /locationPhotos.html     # Location photos HTML file, showing photos of locations
    /locationReviews.html    # Location reviews file, showing reviews of locations
    /login.html              # Login HTML file, the log-in page
    /main.html               # Main HTML file, the main page
    /map.html                # Map HTML file, showing the app's story
    /profile.html            # Profile HTML file, the user's profile
    /saved.html              # Saved HTML file, showing the users' saved locations
    /thanks.html             # Thanks HTML file, showing the appreciation to users

├── images                   # Folder for images
    /backButton.jpg          # FlatIcon
    /background.jpg          # iLikeWallpaper
    /bookmark.png            # FlatIcon
    /cameraIcon.png          # FlatIcon
    /cameraIconWhite.png     # FlatIcon
    /default_profile         # FlatIcon
     _circle.png
    /gallery.png             # FlatIcon
    /home.png                # FlatIcon
    /loupe.png               # FlatIcon
    /plus.ico                # Favicon
    /plus.png                # FlatIcon
    /profile-user.png        # FlatIcon
    /recent.png              # FlatIcon
    /reviewIcon.jpg          # FlatIcon
    /reviewIconWhite.jpg     # FlatIcon
    /right-arrow.png         # FlatIcon
    /snowRoad.jpg            # iLikeWallpaper
    /snowy.jpg               # iLikeWallpaper
    /snowyRoad.jpeg          # iLikeWallpaper
    /weather.png             # FlatIcon
    /whitePlus.png           # FlatIcon
    /winterBackground.jpeg   # iLikeWallpaper
    /winterBackground2.jpeg  # iLikeWallpaper
    /winterBackground3.jpeg  # iLikeWallpaper
    /winterBackground4.jpg   # iLikeWallpaper

├── scripts                  # Folder for scripts
    /firebaseAPI_BBY16.js    # firebase API stuff, shared across pages
    /add.js                  # JS for add.html
    /addPhoto.js             # JS for addPhoto.html
    /authentication.js       # firebase authentication, shared across pages
    /index.js                # JS for index.html
    /locationPhotos.js       # JS for locationPhotos.html
    /locationReviews.js      # JS for locationReviews.html
    /main.js                 # JS for main.html
    /mainReviewCard.js       # JS for login.html
    /map.js                  # JS for map.html
    /mapMain.js              # JS for map on main.html
    /profile.js              # JS for profile.html
    /saved.js                # JS for saved.html
    /search.js               # JS to write searches
    /weather.js              # JS for weather widget on main.html

├── styles                   # Folder for styles
    /blah.css                #

Firebase hosting files:
├── .firebase
	/hosting..cache
├── .firebaserc
├── 404.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── storage.rules

```

## Acknowledgements

- <a href="https://fonts.google.com/">Google Fonts</a>
- <a href="https://getbootstrap.com/">Bootstrap</a>
- <a href="https://bcit-cst.notion.site/Tech-Tip-B01a-How-to-make-a-Post-upload-an-image-with-the-post-7e052ed0ea9b4428807a730df1b7125d">COMP 1800 Tech Tip B01a: How to make a Post, upload an image (with the post)?</a>
- <a href="https://bcit-cst.notion.site/M01-How-to-implement-a-Mapbox-and-put-coordinates-of-events-and-the-user-location-on-the-map-59184d709f254993b16cb40f14ed0480">COMP 1800 Tech Tip M01: How to implement a Mapbox and put coordinates of events and the user location on the map?</a>
