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

async function getAutocomplete(){
    var ref = database.ref();
    var phoneformat = /^\d{10}$/;
    var wordformat = /^[A-z]+:[A-z]*$/;
    var arr = [];
    //Shift if statement to other autocomplete function
    if (document.getElementById("input").value.match(phoneformat)){
        document.getElementById("error").style.display = 'none';
        getWords();
    }
    else if (document.getElementById("input").value.match(wordformat)){
        words = document.getElementById("input").value;
        first_word = words.split(":")[0] + ":";
        if (words.split(":").length < 2){
            queryString = "a";
        }
        else{
            queryString = words.split(":")[1];
        }
        
        var promise1 = ref.child('phonemappings').orderByChild('word').startAt(queryString).endAt(queryString + '\uf8ff').limitToFirst(10).once("value")
        return promise1;
        
    }
    else {
        //var phone1 = ref.child('phonemappings').orderByChild('word').equalTo(word1).once("value")
        queryString = document.getElementById("input").value;
        var promise1 = ref.child('phonemappings').orderByChild('word').startAt(queryString).endAt(queryString + '\uf8ff').limitToFirst(10).once("value")
        return promise1;
    }
    
    //console.log(ref.child('phonemappings/word').startAt(queryString).endAt(queryString + '\uf8ff').limit(5));
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


function autocomplete(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        arr = [];
        var wordformat = /^[A-z]+:[A-z]*$/;
        var two_words = false;
        getAutocomplete().then((value2) =>
        {
            if (document.getElementById("input").value.match(wordformat)) {
                value2.forEach(function(data)
                {
                    arr.push(first_word + data.child("word").val())
                });
                two_words = true;
            }
            else {
                value2.forEach(function(data)
                {
                    arr.push(data.child("word").val())
                });
            }
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    if (two_words){
                        getResult();
                    }
                    else {
                        inp.value = inp.value + ":";
                        inp.dispatchEvent(new Event('input', { bubbles: true }));

                    }
                    closeAllLists();
                });
                a.appendChild(b);
            }
            }
        });
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }

document.getElementById("Submit").addEventListener("click", getResult);
document.getElementById("words_result").style.display = 'none';
document.getElementById("error").style.display = 'none';
document.getElementById("map").style.display = 'none';
document.getElementById("map_result").style.display = 'none';
document.getElementById("phone_result").style.display = 'none';
//document.getElementById("input").addEventListener("input", autoComplete);
autocomplete(document.getElementById("input"))

