
// this function animates the navbar sliding down once the user scrolls down
//the navbar will hide itself once the user reaches the top of the page
window.onscroll = function() {scrollFunction()};
function scrollFunction(){
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20){
        document.getElementById("top-navbar").style.top = "0";
    }else{
        document.getElementById("top-navbar").style.top = "-60px";
    }
}

var a = 1;
var active = document.getElementsByClassName("active")

function change_name(){
    active[0].innerHTML = "Hello";
}


let currentIndex = 0;
const textBlocks = document.querySelectorAll('.text-block');

// Initialize the first text block and the circles
function init() {
    textBlocks[currentIndex].style.display = 'block';
    updateCircles();
}

function setCurrentSlide(index) {
    textBlocks[currentIndex].style.display = 'none';
    currentIndex = index;
    textBlocks[currentIndex].style.display = 'block';
    updateCircles();
}

function updateCircles() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

init(); // Call the init function to start the slider


