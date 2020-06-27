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
    event.preventDefault();
    var phone = document.getElementById("inputPhone").value;
    var words = document.getElementById("inputWord").value;
    document.getElementById("output").value = words;
    if (phone.length == 0){
        document.getElementById("output").innerHTML = words;
        console.log("2");
    }
    else if (words.length == 0){
        first_num = phone.slice(0, 5);
        second_num = phone.slice(5);
        console.log(first_num);
        console.log(second_num);
        document.getElementById("output").innerHTML = phone;
        var leadsRef = database.ref('mappings');
        leadsRef.orderByKey().limitToFirst(1);
    }
/*     
    console.log("begin");
    var leadsRef = database.ref('mappings');
    leadsRef.on('value', function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
         var childData = snapshot.node_.children_.root_.value.value_;
         console.log("snapshot.node_.children_.root_.value.value_: ", snapshot.node_.children_.root_.value.value_)
        });
    }); */
}


document.getElementById("Submit").addEventListener("click", something, false);