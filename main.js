
// this function animates the navbar sliding down once the user scrolls down
//the navbar will hide itself once the user reaches the top of the page
window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementsByClassName("top-navbar")[0].style.top = "0";
    } else {
        document.getElementsByClassName("top-navbar")[0].style.top = "-60px";
    }
}

var a = 1;
var active = document.getElementsByClassName("active")

function change_name() {
    active[0].innerHTML = "Hello";
}

//create node list of all elements with class name text-block
let currentIndex = 0;
const textBlocks = document.querySelectorAll('.text-block');

// Initialize the first text block and the dots
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

//updates the appearance of the circle in accordance with the text blocks
function updateCircles() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

init(); // Call the init function to start the slider

//switch between annual and monthly prices in pricing page when user clicks on the checkbox
const checkbox = document.getElementById('checkbox');
const proPrice = document.getElementById('#pro.price');
const advancedPrice = document.getElementById('#advanced.price');
const basicPrice = document.getElementById('#basic.price');



checkbox.addEventListener('click', () => {
    basicPrice.textContent = basicPrice.textContent === '$99.99' ? '$9.99' : '$99.99';
    advanced.textContent = advancedPrice.textContent === '$199.99' ? '$14.99' : '$199.99';
    pro.textContent = proPrice.textContent === '$299.99' ? '$24.99' : '$299.99';



});






