
var slideIndex = 1;
showSlides(slideIndex);
var slideInterval = setInterval(function () { plusSlides(1); }, 4000);

function plusSlides(n) {
    clearInterval(slideInterval);
    showSlides(slideIndex += n);
    slideInterval = setInterval(function () { plusSlides(1); }, 4000);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlide");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

var mybutton = document.getElementById("scrollBtn");


window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
};


function scrollToTop() {
    document.body.scrollTop = 0;

}




