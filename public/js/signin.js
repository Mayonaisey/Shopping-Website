function validateForm(event) {

  //deh 3shan matkhleesh el page t refresh abl ma el js y execute :)

event.preventDefault(); 

  const semail = document.getElementById('signemail').value;
const spassword = document.getElementById('signpassword').value;

if (semail === 'admin@gmail.com' && spassword === 'admin123') {
window.location.href = 'dashboard.ejs';
 }
}