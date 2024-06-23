
function printError(id,msg){
    document.getElementById(id).innerHTML=msg;
}
function change() {
   xusername.innerHTML = user.username;
   xemail.innerHTML = user.email;
   xpassword.innerHTML = user.password;
   xnumber.innerHTML = user.number;
   xcountry.innerHTML = user.country;
   xaddress.innerHTML = user.address;
   xdetails.innerHTML = user.details;

   document.getElementById('editButton').style.display = 'inline-block';

   
 }
window.onload=function(){
    const newValue=sessionStorage.getItem("newValue");
    document.getElementById("to").value=parseFloat(newValue).toFixed(1)+" EGP";
}
