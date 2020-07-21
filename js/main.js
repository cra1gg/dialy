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
    document.getElementById("error").style.display = 'none';
    document.getElementById("words_result").style.display = 'none';
    document.getElementById("map").style.display = 'none';
    document.getElementById("map_result").style.display = 'none';
    document.getElementById("phone_result").style.display = 'none';

    event.preventDefault();

    var phoneformat = /^\d{10}$/;
    var wordformat = /^[A-z]+:[A-z]+$/;

    if (document.getElementById("input").value.match(phoneformat)) {
        document.getElementById("error").style.display = 'none';

        getWords();
    } else if (document.getElementById("input").value.match(wordformat)) {
        document.getElementById("error").style.display = 'none';
        getPhone();

    } else {
        document.getElementById('error').innerHTML = "Please enter a phone number or a PhoneWord";
        document.getElementById("error").style.display = 'inline-block';
    }
}

async function getPhone() {
    var words = document.getElementById("input").value;
    var word1 = words.split(":")[0];
    var word2 = words.split(":")[1];

    var ref = database.ref();
    var phone1 = ref.child('phonemappings').orderByChild('word').equalTo(word1).once("value")
    var phone2 = ref.child('phonemappings').orderByChild('word').equalTo(word2).once("value")


    Promise.all([phone1, phone2]).then((values) => {
        document.getElementById('phone_result').innerHTML = "Loading results...";

        var resultnum1;
        var resultnum2;
        values[0].forEach(function (data) {
            resultnum1 = data.child("number").val();
        });
        values[1].forEach(function (data) {
            resultnum2 = data.child("number").val();
        });
        var result = resultnum1 + resultnum2;
        if (isNaN(result)) {
            document.getElementById('error').innerHTML = "Invalid PhoneWord. Check the input and try again.";
            document.getElementById("error").style.display = 'inline-block';
        } else {
            fetch('http://apilayer.net/api/validate?format=1&number=1' + result + '&access_key=a81a028c96fe1f4a4b906b22ae479cea')
                .then((resp) => resp.json())
                .then(function (data) {
                    console.log(data)
                    var formatted = `Valid` + data.valid + "Number" + data.number + "\n\Local Format"
                        + data.local_format + "\n\International Format" + data.international_format
                        + "\n\Country Prefix" + data.country_prefix + "\n\Country Code" + data.country_code
                        + "\n\Country Name" + data.country_name + "\n\City" + data.location + "\n\Carrier"
                        + data.carrier + "\n\Line Type" + data.line_type

                    //https://www.google.com/maps/search/ottowa+canada
                    //https://maps.google.com/maps?q=chicago&t=&z=13&ie=UTF8&iwloc=&output=embed
                    document.getElementById("map_result").style.display = 'inline-block';
                    document.getElementById("map").style.display = 'inline-block';

                    document.getElementById("phone_result").style.display = 'inline-block';
                    document.getElementById('phone_result').innerHTML = "(" + result.slice(0, 3) + ") " + result.slice(3, 6) + "-" + result.slice(6, 10);


                    var mapLoc = data.location + "+" + data.country_name;
                    console.log(mapLoc);

                    document.getElementById('map').src = "https://maps.google.com/maps?q=" + mapLoc + "&t=&z=13&ie=UTF8&iwloc=&output=embed";


                    document.getElementById('location').innerHTML = data.location + ", " + data.country_name;
                    document.getElementById('carrier').innerHTML = +data.carrier + data.line_type;

                    //Add case for surpassing api call limit
                })
                .catch(function (error) {
                    console.log(error);
                });

        }

    })

}

async function getWords() {
    var phone = document.getElementById("input").value;
    first_num = phone.slice(0, 5);
    second_num = phone.slice(5);

    var ref = database.ref();
    var word1 = ref.child('mappings').orderByChild('number').equalTo(first_num).once("value")
    var word2 = ref.child('mappings').orderByChild('number').equalTo(second_num).once("value")

    Promise.all([word1, word2]).then((values) => {
        var resultword1;
        var resultword2;

        values[0].forEach(function (data) {
            resultword1 = data.child("word").val();
        });

        values[1].forEach(function (data) {
            resultword2 = data.child("word").val();
        });

        document.getElementById("words_result").style.display = 'inline-block';
        document.getElementById('words_result').innerHTML = resultword1 + ":" + resultword2;
    })
}

document.getElementById("Submit").addEventListener("click", getResult);
document.getElementById("words_result").style.display = 'none';
document.getElementById("error").style.display = 'none';
document.getElementById("map").style.display = 'none';
document.getElementById("map_result").style.display = 'none';
document.getElementById("phone_result").style.display = 'none';

