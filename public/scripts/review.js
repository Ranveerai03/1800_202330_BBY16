document.getElementById("homeBtn").onclick = function(){
    location.href = "../../app/html/main.html"
}
document.getElementById("bookmarkBtn").onclick = function(){
    location.href = "../../app/html/saved.html"
}
document.getElementById("plusBtn").onclick = function(){
    location.href = "../../app/html/plus.html"
}
document.getElementById("searchBtn").onclick = function(){
    location.href = "../../app/html/search.html"
}
document.getElementById("profileBtn").onclick = function(){
    location.href = "../../app/html/profile.html"
}

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
          .then(() =>{
                console.log("5. Saved to user's document!");
                                alert ("Post is complete!");
                //window.location.href = "showposts.html";
           })
           .catch((error) => {
                console.error("Error writing document: ", error);
           });
    })
}