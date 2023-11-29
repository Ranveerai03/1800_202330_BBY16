function populateReviews() {
    let reviewCardTemplate = document.getElementById("card-template");
    let reviewCardGroup = document.getElementById("reviewCardGroup");
  
    let locationID = "ywwzV8QsjT5rbQYyadp7";
    console.log(locationID);
    // Double-check: is your collection called "Reviews" or "reviews"?
    db.collection("reviews")
      .where("locationID", "==", locationID)
      .get()
      .then((allReviews) => {
        const reviews = allReviews.docs;
        if (reviews.length > 0) {
          const doc = reviews[0];
          var condition = doc.data().condition;
          console.log(condition);
          var icy = doc.data().icy;
          // var docID = doc.id;
          console.log("hello");
          var comment = doc.data().comment;
          var time = doc.data().timestamp.toDate();
          // const bookmarks = doc.data().bookmarks;
          // let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.
  
          console.log(time);
  
          let reviewCard = reviewCardTemplate.content.cloneNode(true);
          reviewCard.querySelector(".condition").innerHTML = `Condition: <b>${condition}</b>`;
          reviewCard.querySelector(".time").innerHTML = new Date(time).toLocaleString();
          reviewCard.querySelector(".icy").innerHTML = `Icy: ${icy}`;
          reviewCard.querySelector(".comment").innerHTML = `Comments: ${comment}`;
  
          reviewCardGroup.appendChild(reviewCard);
        }
      });
  }


populateReviews();