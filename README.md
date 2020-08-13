![Dialy](https://i.imgur.com/7ErzpV2.png)

#http://dialy.xyz

#What is Dialy?
Dialy is a radical new take on phone numbers. Instead of having to memorize a random sequence of ten digits, phone numbers are assigned Dialys; two short words that are easy to remember. Now, instead of having to memorize all these random numbers, all you have to remember is two simple words?

#Why does Dialy exist?
Dialy was heavily inspired by [What3Words](https://what3words.com/). The founders of Dialy were curious as to what in what other applications words could be used to reduce the difficulty of remembering things. Phone numbers were one of the first things that came to mind, they are hard to remember and can easily be replaced with two unique words.

#How does it work?
Dialy's interface was designed to be as simple as possible. When users first load the site, they will be greeted with a search bar. 

![Dialy Home Page](https://i.imgur.com/oQAb2J8.png)

In this search bar, you can enter either a Dialy (two words separated by a colon), or a phone number. Dialy takes advantage of Firebase's lightning fast indexing with its low latency autocomplete. If the Dialy exists in the database, users will be able to select it from the autocomplete dropdown

![Dialy autocomplete](https://i.imgur.com/dXEvCBE.png)

The user will then be greeted with the original phone number assigned to the entered Dialy, as well as some accompanying metadata and search history

![Dialy results](https://i.imgur.com/vr7yUgH.png)

Conversely, if a user enters a phone number, they will be shown the Dialy assigned to it

![Dialy phone results](https://i.imgur.com/5DNUZrh.png)

#How does it work?
Dialy works by splitting all phone numbers up into two groups of 5 digits. Because of this, Dialy only supports North American phone numbers at the moment. Significant changes to the codebase would need to be made to support numbers from other countries. Dialy assigns one word to each 5 digit number, so it uses a total of 10^5 (100,000) words and assigns two words to every possible ten digit number (even if they are not valid North American phone numbers)

Dialy was created using Vanilla JS and Bootstrap. Dialy uses Firebase for storage of phone/word assignments as well as the search history of each phone number. The website itself is also hosted on Firebase (Yay for free hosting!). Dialy uses [its own api](http://api.dialy.xyz/), repository [here](https://github.com/cra1gg/dialy-api) to get accompanying phone number metadata. It acheives this using Google's [libphonenumber](https://github.com/google/libphonenumber) with a [Python wrapper](https://github.com/daviddrysdale/python-phonenumbers).

Dialy was developed over the Summer of 2020 by two amateur CS students. As a result, you're almost guaranteed to encounter bugs. If you do, feel free to open a detailed bug report
##### By Cra1gg & shmkane
