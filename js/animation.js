// Wrap every letter in a span
try {
    var dialyTitle = document.querySelector('.ml1 .letters');
    dialyTitle.innerHTML = dialyTitle.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    var footerText = document.querySelector('.ml6 .letters');
    footerText.innerHTML = footerText.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
} catch (error) {

}



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