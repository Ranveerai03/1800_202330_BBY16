function savePost() {
    //alert ("Your post has been uploaded!");
    location.href = "../../app/html/thanks.html"
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            var desc = document.getElementById("description").value;
            db.collection("reviews").add({
                owner: user.uid,
                description: desc,
                last_updated: firebase.firestore.FieldValue
                    .serverTimestamp() //current system time
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

function savePostIDforUser(postDocID) {
    firebase.auth().onAuthStateChanged(user => {
        console.log("user id is: " + user.uid);
        console.log("postdoc id is: " + postDocID);
        db.collection("users").doc(user.uid).update({
            myposts: firebase.firestore.FieldValue.arrayUnion(postDocID)
        })
            .then(() => {
                console.log("5. Saved to user's document!");
                alert("Post is complete!");
                //window.location.href = "showposts.html";
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    })
}
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
    // const icyDropdownMenu = document.getElementById('icy-road');
    // const icyValue = icyDropdownMenu.value;
    const form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);

    function handleSubmit(event) {
        const collectionRef = db.collection("reviews");
        event.preventDefault();
        const review = document.getElementById('review').value;
        const condition = document.getElementById('snow-type').value;
        const icy = document.getElementById('icy-road').value === 'yes';
        const timestamp = firebase.firestore.Timestamp.now();

        const docRef = db.collection("searches").doc(reviewLocation);
        console.log(docRef);

        // Update the timestamp field with the new value
        docRef.update({last_updated: timestamp })
            .then(() => {
                console.log('Timestamp updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating timestamp:', error);
            });

        collectionRef.add({
            comment: review,
            condition: condition,
            icy: icy,
            timestamp: timestamp,
            locationID: reviewLocation
        })
            .then(() => {
                console.log('Review submitted successfully!');
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
            .catch((error) => {
                console.error('Error submitting review:', error);
            });
    }
}
addReview();

