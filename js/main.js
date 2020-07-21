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
    document.getElementById("result").style.display = 'none';
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
        if (isNaN(result)){
            document.getElementById('error').innerHTML = "That phoneword is not valid. Please try again.";
            document.getElementById("error").style.display = 'inline-block';
        }
        else {
            fetch('http://apilayer.net/api/validate?format=1&number=1' + result + '&access_key=a81a028c96fe1f4a4b906b22ae479cea')
            .then((resp) => resp.json())
            .then(function(data) {
                console.log(data)
                var formatted = `Valid` + data.valid + "Number" + data.number + "\n\Local Format" + data.local_format + "\n\International Format" + data.international_format + "\n\Country Prefix" + data.country_prefix + "\n\Country Code" + data.country_code + "\n\Country Name" + data.country_name + "\n\City" + data.location + "\n\Carrier" + data.carrier + "\n\Line Type" + data.line_type
                document.getElementById('result').innerHTML = formatted;
                document.getElementById("result").style.display = 'inline-block';
                //Add case for surpassing api call limit
            })
            .catch(function(error) {
                console.log(error);
            });  
            
        }
        
    })
    
}

async function autoComplete(){
    var ref = database.ref();
    //var phone1 = ref.child('phonemappings').orderByChild('word').equalTo(word1).once("value")
    queryString = document.getElementById("input").value;
    var promise1 = ref.child('phonemappings').orderByChild('word').startAt(queryString).endAt(queryString + '\uf8ff').once("value")
    promise1.then((value2) =>
    {
        value2.forEach(function(data)
        {
            console.log(data.child("word").val())
        });
    });
    //console.log(ref.child('phonemappings/word').startAt(queryString).endAt(queryString + '\uf8ff').limit(5));
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
document.getElementById("input").addEventListener("input", autoComplete);

