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


// Begin by hiding everything
hideAll();


//When the user clicks convert, this is run
async function getResult() {
    //Reset the error to hidden incase it was activated.
    document.getElementById("error").style.display = 'none';

    //prevent refreshing of page
    event.preventDefault();

    /*REGEX for phone and word format.
    Phone: dddddddddd, i.e. 10 digits
    Word: ccccc:cc, i.e. colon sepatated characters
    */
    var phoneformat = /^\d{10}$/;
    var wordformat = /^[A-z]+:[A-z]+$/;

    //If the user input a phone number
    var user_in = document.getElementById("input").value;
    var you_entered = document.getElementById("show_input");

    if (user_in.match(phoneformat)) {
        document.getElementById("error").style.display = 'none';

        getWords();

        //If the user input a dialy
    } else if (user_in.toLowerCase().match(wordformat)) {
        document.getElementById("error").style.display = 'none';

        you_entered.innerHTML = "<span class=\"text-white weight-900\">You entered:</span> <strong>" + user_in.toString() + "</strong>";

        you_entered.classList.add("text-white-50");
        you_entered.classList.add("weight-900");
        getPhone();

    } else {//user input something that didnt match the format.
        hideAll();
        document.getElementById('error').innerHTML = "Please enter a valid phone number or a Dialy";
        document.getElementById("error").style.display = 'block';
    }
}

async function logtoDb(phonenum, dialy){
    var ref = database.ref().child('searchhistory');
    var keyToUse;
    var exists = false;
    var previous_count = 0;
    var phone_check = ref.orderByChild('phone_num').equalTo(phonenum).once("value");
    phone_check.then((value) => {
        value.forEach(function (data) {
            exists = true
            previous_count = data.child("num_times").val();
            keyToUse = data.key;
            console.log("Already exists, key is")
            console.log(data.key)
        })
        if (exists == true) {
            var postData = {
                phone_num: phonenum,
                dialy: dialy,
                num_times: previous_count + 1
            };
            var curr = {};
            curr['/'+ keyToUse] = postData;
            ref.update(curr);
        }
        else {
            var postData = {
                phone_num: phonenum,
                dialy: dialy,
                num_times: 1
            };
            var newPushKey = ref.push().key;
            var curr = {};
            curr['/'+ newPushKey] = postData;
            ref.update(curr);
        }
        total_conversions.innerHTML = "This has been converted <strong>" + (previous_count + 1) + "</strong> times." 
    });
    
    
    
}

/**
 * User input a phone number, now we want to print out a Dialy
 */
async function getWords() {
    hideAll();//Start with everything hidden again.

    //Show our dialy div
    document.getElementById("words_result").style.display = 'initial';
    document.getElementById("entered").style.display = 'initial';

    var user_in = document.getElementById("input").value;
    var you_entered = document.getElementById("show_input");

    //Slice the number to format
    var ref = database.ref();
    var phoneformat = /^\d{10}$/;
    var wordformat = /^[A-z]+:[A-z]*$/;
    var phoneformat2 = /^\(\d{3}\)\s\d{3}-\d{4}/
    var arr = [];
    var phone;
    //Shift if statement to other autocomplete function
    if (document.getElementById("input").value.match(phoneformat)){
        phone = document.getElementById("input").value;
    }
    else if (document.getElementById("input").value.match(phoneformat2)) {
        phone = document.getElementById("input").value.replace("(", "").replace(")", "").replace("-", "").replace(" ", "");
    }

    var phone = document.getElementById("input").value;
    var total_conversions = document.getElementById("total_conversions");

    first_num = phone.slice(0, 5);
    second_num = phone.slice(5);
    //
    you_entered.classList.add("text-white-50");
    you_entered.classList.add("weight-900");

    you_entered.innerHTML = "<span class=\"text-white\">You entered:</span> <strong>" + splitAndFormatPhoneNumber(phone) + "</strong>"
    //total_conversions.innerHTML = "This has been converted <strong>" + "TODO:Add here" + "</strong> times."
    //total_conversions

    var ref = database.ref();
    var word1 = ref.child('mappings').orderByChild('number').equalTo(first_num).once("value")
    var word2 = ref.child('mappings').orderByChild('number').equalTo(second_num).once("value")

    logtoDb(phone, document.getElementById("dialy").innerHTML)
    Promise.all([word1, word2]).then((values) => {
        var resultword1;
        var resultword2;
        values[0].forEach(function (data) {
            resultword1 = data.child("word").val().toLowerCase();
        });
        values[1].forEach(function (data) {
            resultword2 = data.child("word").val().toLowerCase();
        });

        document.getElementById("dialy").innerHTML = resultword1 + ":" + resultword2;
        document.getElementById("active").id = 'inactive'
        document.getElementById("results").id = 'active'

    }).then(
        function () {
            document.querySelector('#how_to').scrollIntoView({
                behavior: 'smooth'
            });
        }
    )
}

/**
 * User input a Dialy, now we want to output a map and print a number
 */
async function getPhone() {
    hideAll();//Start with everything hidden again.
    document.getElementById("entered").style.display = 'initial';
    // Scroll to a certain element
    //document.getElementById("myDIV").style.display = "block"



    var words = document.getElementById("input").value;
    var word1 = words.split(":")[0].toLowerCase();
    var word2 = words.split(":")[1].toLowerCase();

    var ref = database.ref();
    var phone1 = ref.child('phonemappings').orderByChild('word').equalTo(word1).once("value")
    var phone2 = ref.child('phonemappings').orderByChild('word').equalTo(word2).once("value")


    Promise.all([phone1, phone2]).then((values) => {
        var resultnum1;
        var resultnum2;

        values[0].forEach(function (data) {
            resultnum1 = data.child("number").val();
        });

        values[1].forEach(function (data) {
            resultnum2 = data.child("number").val();
        });

        var result = resultnum1 + resultnum2;
        document.getElementById("numbers_result").style.display = 'grid';
        logtoDb(result, document.getElementById("input").innerHTML)
        if (isNaN(result)) {
            hideAll();
            document.getElementById('error').innerHTML = "Invalid Dialy. Check the input and try again.";
            document.getElementById("error").style.display = 'block';
        } else {
            fetch('https://api.dialy.xyz/lookup/+1' + result)
                .then((resp) => resp.json())
                .then(function (data) {
                    // var formatted = "Valid" + data.valid + "Number" + data.number + "\n\Local Format"
                    //     + data.local_format + "\n\International Format" + data.international_format
                    //     + "\n\Country Prefix" + data.country_prefix + "\n\Country Code" + data.country_code
                    //     + "\n\Country Name" + data.country_name + "\n\City" + data.location + "\n\Carrier"
                    //     + data.carrier + "\n\Line Type" + data.line_type

                    //https://www.google.com/maps/search/ottowa+canada
                    //https://maps.google.com/maps?q=chicago&t=&z=13&ie=UTF8&iwloc=&output=embed
                    document.getElementById('phone_number').innerHTML = "(" + result.slice(0, 3) + ") " + result.slice(3, 6) + "-" + result.slice(6, 10);

                    //document.getElementById("active").id = 'inactive'
                    document.getElementById("results").id = 'active'

                    var mapLoc = data.location; //+ "+" + data.country_name;

                    document.getElementById('map').src = "https://maps.google.com/maps?q=" + mapLoc + "&t=&z=10&ie=UTF8&iwloc=&output=embed";
                    document.getElementById('line_type').innerHTML = data.line_type;
                    
                    if (data.valid.toString() == 'true') {
                        document.getElementById('phone_isValid').innerHTML = "Yes";
                    }
                    else {
                        document.getElementById('phone_isValid').innerHTML = "No"
                    }
                    //Switch to ternary operator one day
                    if (data.carrier == "") {
                        document.getElementById('phone_carrier').innerHTML = "N/A"
                    }
                    else {
                        document.getElementById('phone_carrier').innerHTML = data.carrier
                    }


                    //Add case for surpassing api call limit
                })
                .catch(function (error) {
                    console.log(error);
                });

        }

    }).then(
        function () {
            document.querySelector('#how_to').scrollIntoView({
                behavior: 'smooth'
            });
        }
    )
}

// Hides all the elements of results
function hideAll() {
    document.getElementById("words_result").style.display = 'none';
    document.getElementById("numbers_result").style.display = 'none';
    document.getElementById("entered").style.display = 'none';
    document.getElementById("error").style.display = 'none';
}

function splitAndFormatPhoneNumber(phone) {
    return "(" + phone.slice(0, 3) + ")" + " " + phone.slice(3, 6) + "-" + phone.slice(6, 10);
}

async function getAutocomplete() {
    var ref = database.ref();
    var phoneformat = /^\d{10}$/;
    var wordformat = /^[A-z]+:[A-z]*$/
    var phoneformat2 = /^\(\d{3}\)\s\d{3}-\d{4}/
    var arr = [];

    //Shift if statement to other autocomplete function
    if (document.getElementById("input").value.match(phoneformat) || document.getElementById("input").value.match(phoneformat2)) {
        document.getElementById("error").style.display = 'none';
        getWords();
    }
    else if (document.getElementById("input").value.match(wordformat)) {
        words = document.getElementById("input").value.toLowerCase();
        first_word = words.split(":")[0] + ":";
        if (words.split(":").length < 2) {
            queryString = "a";
        }
        else {
            queryString = words.split(":")[1];
        }
        var promise1 = ref.child('phonemappings').orderByChild('word').startAt(queryString).endAt(queryString + '\uf8ff').limitToFirst(4).once("value")
        return promise1;
    }
    else {
        queryString = document.getElementById("input").value.toLowerCase();
        var promise1 = ref.child('phonemappings').orderByChild('word').startAt(queryString).endAt(queryString + '\uf8ff').limitToFirst(4).once("value")
        return promise1;
    }

    //console.log(ref.child('phonemappings/word').startAt(queryString).endAt(queryString + '\uf8ff').limit(5));
}

// Code related to auto complete
function autocomplete(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        arr = [];
        var wordformat = /^[A-z]+:[A-z]*$/;
        var two_words = false;
        getAutocomplete().then((value2) => {
            if(value2 == undefined) {
                return;
            }
            if (document.getElementById("input").value.match(wordformat)) {
                value2.forEach(function (data) {
                    arr.push(first_word + data.child("word").val())
                });
                two_words = true;
            }
            else {
                value2.forEach(function (data) {
                    arr.push(data.child("word").val())
                });
            }


            arr.sort(function (a, b) {
                // ASC  -> a.length - b.length
                // DESC -> b.length - a.length
                return a.length - b.length;
            });
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
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
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;

                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        if (two_words) {
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
    inp.addEventListener("keydown", function (e) {
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

function copyClipboard(text){
    var id = "mycustom-clipboard-textarea-hidden-id";
    var existsTextarea = document.getElementById(id);

    if(!existsTextarea){
        var textarea = document.createElement("textarea");
        textarea.id = id;
        // Place in top-left corner of screen regardless of scroll position.
        textarea.style.position = 'fixed';
        textarea.style.top = 0;
        textarea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textarea.style.width = '1px';
        textarea.style.height = '1px';

        // We don't need padding, reducing the size if it does flash render.
        textarea.style.padding = 0;

        // Clean up any borders.
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textarea.style.background = 'transparent';
        document.querySelector("body").appendChild(textarea);
        existsTextarea = document.getElementById(id);
    }

    existsTextarea.value = document.querySelector('#' + text).textContent;
    existsTextarea.select();

    try {
        var status = document.execCommand('copy');
    } catch (err) {
        console.log('Unable to copy.');
    }
}

//add a click event to the submit button
// document.getElementById("submit").addEventListener("click", getResult); // Submit Button click event
autocomplete(document.getElementById("input"));

// Wrap every letter in a span
var dialyTitle = document.querySelector('.ml1 .letters');
var footerText = document.querySelector('.ml6 .letters');

dialyTitle.innerHTML = dialyTitle.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
footerText.innerHTML = footerText.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({ loop: false })
    .add({
        targets: '.ml1 .letter',
        scale: [0.3, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 600,
        delay: (el, i) => 70 * (i + 1)
    }).add({
        targets: '.ml1 .line',
        scaleX: [0, 1],
        opacity: [0.5, 1],
        easing: "easeOutExpo",
        duration: 700,
        offset: '-=875',
        delay: (el, i, l) => 80 * (l - i)
    });


anime.timeline({ loop: false })
    .add({
        targets: '.ml6 .letter',
        translateY: ["1.1em", 0],
        translateZ: 0,
        duration: 1000,
        delay: (el, i) => 50 * i
    });