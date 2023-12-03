// import 'firebase/storage';

var reviewLocation;

function addReview() {
    const collectionRef = db.collection("searches");
    console.log(collectionRef);
    collectionRef.get().then((querySnapshot) => {
        const dropdownMenu = document.getElementById('dropdown-menu');
        querySnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.text = doc.data().name;
            dropdownMenu.add(option);
        });
    });

    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.addEventListener('change', (event) => {
        // Do something with the selected item
        const selectedName = event.target.value;
        console.log(selectedName);
        collectionRef.where('name', '==', selectedName).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Do something with the data
                reviewLocation = doc.id;
                console.log(reviewLocation);
            });
        });
    });
}

addReview();

var ImageFile;
function listenFileSelect() {
    // listen for file selection
    var fileInput = document.getElementById("mypic-input"); // pointer #1
    const image = document.getElementById("mypic-goes-here"); // pointer #2

    // When a change happens to the File Chooser Input
    fileInput.addEventListener('change', function (e) {
        ImageFile = e.target.files[0];   //Global variable
        var blob = URL.createObjectURL(ImageFile);
        image.src = blob; // Display this image
    })
}
listenFileSelect();

document.getElementById("submit").onclick = function () {
    savePost();
}

function savePost() {
    // alert("SAVE POST is triggered");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            // var desc = document.getElementById("description").value;
            db.collection("photos").add({
                owner: user.uid,
                // description: desc,
                last_updated: firebase.firestore.FieldValue.serverTimestamp(), //current system time
                locationID: reviewLocation
            }).then(doc => {
                console.log("1. Post document added!");
                console.log(doc.id);
                uploadPic(doc.id);
            })
        } else {
            // No user is signed in.
            console.log("Error, no user signed in");
        }
    });
}
//------------------------------------------------
// So, a new post document has just been added
// and it contains a bunch of fields.
// We want to store the image associated with this post,
// such that the image name is the postid (guaranteed unique).
// 
// This function is called AFTER the post has been created, 
// and we know the post's document id.
//------------------------------------------------
function uploadPic(postDocID) {
    console.log("inside uploadPic " + postDocID);
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(ImageFile)   //global variable ImageFile

        // AFTER .put() is done
        .then(function () {
            console.log('2. Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()

                // AFTER .getDownloadURL is done
                .then(function (url) { // Get URL of the uploaded file
                    console.log("3. Got the download URL.");

                    // Now that the image is on Storage, we can go back to the
                    // post document, and update it with an "image" field
                    // that contains the url of where the picture is stored.
                    db.collection("photos").doc(postDocID).update({
                        "image": url // Save the URL into users collection
                    })
                        // AFTER .update is done
                        .then(function () {
                            console.log('4. Added pic URL to Firestore.');
                            // One last thing to do:
                            // save this postID into an array for the OWNER
                            // so we can show "my posts" in the future
                            // savePostIDforUser(postDocID);

                            swal({
                                title: "Success!",
                                text: "Redirecting in 2 seconds.",
                                type: "success",
                                timer: 2000,
                                showConfirmButton: false
                            }, function () {
                                window.location.href = "../../app/html/add.html";
                            });
                        })
                })
        })
        .catch((error) => {
            console.log("error uploading to cloud storage");
        })
}

