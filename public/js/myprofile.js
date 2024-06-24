
document.addEventListener('DOMContentLoaded', () => {
  
  openpersonal();
});

function openpersonal() {
  View();
  document.getElementById('personal-info').style.display = 'block'; 

  document.getElementById('editdiv').style.display = 'none'; 
  
  document.getElementById('contactdiv').style.display = 'none'; 
  
  document.getElementById('orderdiv').style.display = 'none'; 
  document.getElementById('wishdiv').style.display = 'none'; 
  
  
  }

function openwishlist() {
document.getElementById('wishdiv').style.display = 'block'; 
document.getElementById('orderdiv').style.display = 'none'; 
document.getElementById('contactdiv').style.display = 'none'; 
document.getElementById('editdiv').style.display = 'none'; 
document.getElementById('personal-info').style.display = 'none'; 


}

function openorder() {
document.getElementById('orderdiv').style.display = 'block'; 
document.getElementById('wishdiv').style.display = 'none'; 
document.getElementById('contactdiv').style.display = 'none'; 
document.getElementById('editdiv').style.display = 'none'; 
document.getElementById('personal-info').style.display = 'none'; 


}


function opencontact() {
document.getElementById('contactdiv').style.display = 'block'; 

document.getElementById('orderdiv').style.display = 'none'; 
document.getElementById('wishdiv').style.display = 'none'; 
document.getElementById('editdiv').style.display = 'none'; 
document.getElementById('personal-info').style.display = 'none'; 



}

function openedit() {
document.getElementById('editdiv').style.display = 'block'; 

document.getElementById('contactdiv').style.display = 'none'; 

document.getElementById('orderdiv').style.display = 'none'; 
document.getElementById('wishdiv').style.display = 'none'; 
document.getElementById('personal-info').style.display = 'none'; 


}

// script.js

async function logout() {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json(); 

    if (response.ok) {
      console.log('Logout successful');
      alert(data.message); 
      window.location.href = '/accountForm'; // Redirect to accountForm after logout
    } else {
      console.error('Logout failed');
      // Handle error if needed
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Handle error if needed
  }
}
