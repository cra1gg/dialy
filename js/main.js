// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDkwICpMk8dgqUwGKbaLCISVcnq6hsnTcc",
    authDomain: "phone2word.firebaseapp.com",
    databaseURL: "https://phone2word.firebaseio.com",
    projectId: "phone2word",
    storageBucket: "phone2word.appspot.com",
    messagingSenderId: "989899451141",
    appId: "1:989899451141:web:a8186cbdfad2f42896656c",
    measurementId: "G-ZBR9BQFTXW"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();


function something() {
    var input = document.getElementById("inputWord").value();
    event.preventDefault();
    console.log("begin");
    var leadsRef = database.ref('mappings');
    leadsRef.on('value', function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
         var childData = snapshot.node_.children_.root_.value.value_;
         console.log("snapshot.node_.children_.root_.value.value_: ", snapshot.node_.children_.root_.value.value_)
        });
    });
}


document.getElementById("Submit").addEventListener("click", something, false);