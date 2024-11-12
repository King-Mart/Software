

//switch between annual and monthly prices in pricing page when user clicks on the checkbox
const checkbox = document.getElementById('checkbox');
const pro = document.getElementById('pro');
const advanced = document.getElementById('advanced');
const basic = document.getElementById('basic');
//switch between annual and monthly prices in pricing page when user clicks on the checkbox



checkbox.addEventListener('click', () => {
    basic.textContent = basic.textContent === '$9.99' ? '$99.99' : '$9.99';
    advanced.textContent = advanced.textContent === '$14.99' ? '$199.99' : '$14.99';
    pro.textContent = pro.textContent === '$24.99' ? '$299.99' : '$24.99';
});


