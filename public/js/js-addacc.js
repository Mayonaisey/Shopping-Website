

 const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const number = document.getElementById('number');
const country = document.getElementById('country');
const address = document.getElementById('Address');
const details = document.getElementById('details');
const checkbox = document.getElementById('checkbox');



 
function validateForm(event) {

//deh 3shan matkhleesh el page t refresh abl ma el js y execute :)
  event.preventDefault(); 

  let usernameValue = username.value.trim();
let emailValue = email.value.trim();
let passwordValue = password.value.trim();
let password2Value = password2.value.trim();
let numberValue = number.value.trim();
let countryValue = country.value.trim();
let addressValue = address.value.trim();
let detailsValue = details.value.trim();
let checkboxValue = checkbox.checked;

const message = document.getElementById('passmessage');


if (passwordValue !== "") { 
  if (passwordValue === password2Value) {
      message.textContent = "Passwords Match";
     message.style.backgroundColor = "#3ae374";
     form.submit();
  } else {
      message.textContent =  "Password  does not  Match";
     message.style.backgroundColor = "#ff4d4d";
  }
} else {
  alert("password can't be empty !"); 
}
}