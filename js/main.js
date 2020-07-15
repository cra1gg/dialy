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

async function getResult() {
    event.preventDefault();
    var phoneformat = /^\d{10}$/;
    var wordformat = /^[A-z]+:[A-z]+$/;
    if (document.getElementById("input").value.match(phoneformat)){
        document.getElementById("error").style.display = 'none';
        getWords();
    }
    else if (document.getElementById("input").value.match(wordformat)){
        document.getElementById("error").style.display = 'none';
        getPhone();
        
    }
    else {
        document.getElementById('error').innerHTML = "Please enter either a phone number or a combination of two words";
        document.getElementById("error").style.display = 'inline-block';
    }
}

async function getPhone(){
    var words = document.getElementById("input").value;
    var word1 = words.split(":")[0];
    var word2 = words.split(":")[1];
    var ref = database.ref();
    var phone1 = ref.child('phonemappings').orderByChild('word').equalTo(word1).once("value")
    var phone2 = ref.child('phonemappings').orderByChild('word').equalTo(word2).once("value")
    Promise.all([phone1, phone2]).then((values) =>
    {
        var resultnum1;
        var resultnum2;
        values[0].forEach(function(data) {
            resultnum1 = data.child("number").val();
        });
        values[1].forEach(function(data) {
            resultnum2 = data.child("number").val();
        });
        var result = resultnum1 + resultnum2;
        document.getElementById('result').innerHTML = "(" + result.slice(0, 3) + ") " + result.slice(3, 6) + "-" + result.slice(6, 10);
        document.getElementById("result").style.display = 'inline-block';
    })
}

async function getWords(){
    var phone = document.getElementById("input").value;
    first_num = phone.slice(0, 5);
    second_num = phone.slice(5);
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
        document.getElementById("result").style.display = 'inline-block';
    })
}

document.getElementById("Submit").addEventListener("click", getResult);
document.getElementById("result").style.display = 'none';
document.getElementById("error").style.display = 'none';
