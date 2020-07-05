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

async function something2() {
    event.preventDefault();
    var phone = document.getElementById("inputPhone").value;
    var words = document.getElementById("inputWord").value;
    if (phone.length == 0){
        console.log("2");
    } 
    else if (words.length == 0){
        first_num = phone.slice(0, 5);
        second_num = phone.slice(5);
        console.log(first_num);
        console.log(second_num);
        
        var ref = database.ref();

        var word1 = ref.child('mappings').orderByChild('number').equalTo(first_num).once("value")
        var word2 = ref.child('mappings').orderByChild('number').equalTo(second_num).once("value")
        Promise.all([word1, word2]).then((values) =>
        {
            var resultword1;
            var resultword2;
            values[0].forEach(function(data) {
                resultword1 = data.child("word").val();
            });
            values[1].forEach(function(data) {
                resultword2 = data.child("word").val();
            });
            document.getElementById('result').innerHTML = resultword1 + ":" + resultword2;
        })

    }
}

document.getElementById("Submit").addEventListener("click", something2);