function savePost() {
  location.href = "../../app/html/thanks.html";
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var desc = document.getElementById("description").value;
      db.collection("reviews")
        .add({
          owner: user.uid,
          description: desc,
          last_updated: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((doc) => {
          uploadPic(doc.id);
        });
    } else {
    }
  });
}

function savePostIDforUser(postDocID) {
  firebase.auth().onAuthStateChanged((user) => {
    db.collection("users")
      .doc(user.uid)
      .update({
        myposts: firebase.firestore.FieldValue.arrayUnion(postDocID),
      })
      .then(() => {
        alert("Post is complete!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  });
}
var reviewLocation;
function addReview() {
  const collectionRef = db.collection("searches");
  collectionRef.get().then((querySnapshot) => {
    const dropdownMenu = document.getElementById("dropdown-menu");
    querySnapshot.forEach((doc) => {
      const option = document.createElement("option");
      option.text = doc.data().name;
      dropdownMenu.add(option);
    });
  });
  const dropdownMenu = document.getElementById("dropdown-menu");
  dropdownMenu.addEventListener("change", (event) => {
    const selectedName = event.target.value;
    collectionRef
      .where("name", "==", selectedName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          reviewLocation = doc.id;
        });
      });
  });
  const form = document.querySelector("form");
  form.addEventListener("submit", handleSubmit);

  function handleSubmit(event) {
    const collectionRef = db.collection("reviews");
    event.preventDefault();
    const review = document.getElementById("review").value;
    const condition = document.getElementById("snow-type").value;
    const icy = document.getElementById("icy-road").value === "yes";
    const timestamp = firebase.firestore.Timestamp.now();

    const docRef = db.collection("searches").doc(reviewLocation);
    docRef
      .update({ last_updated: timestamp })
      .then(() => {
      })
      .catch((error) => {
        console.error("Error updating timestamp:", error);
      });

    collectionRef
      .add({
        comment: review,
        condition: condition,
        icy: icy,
        timestamp: timestamp,
        locationID: reviewLocation,
      })
      .then(() => {
        swal(
          {
            title: "Success!",
            text: "Redirecting in 2 seconds.",
            type: "success",
            timer: 2000,
            showConfirmButton: false,
          },
          function () {
            window.location.href = "../../app/html/add.html";
          }
        );
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  }
}
addReview();
