
 
 document.getElementById('saveButton').style.display = 'none';
 document.getElementById('deleteButton').style.display = 'none';
async function View() {
  try {
    const response = await fetch('/user', {
      method: 'GET',
      credentials: 'same-origin', // Send session
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();
    console.log('User data fetched:', userData); // Log the fetched user data

    // Update user data in the DOM
    
    document.getElementById('newusername').value = userData.fullname;
    document.getElementById('newemail').value = userData.email;
    document.getElementById('newnumber').value = userData.phoneNumber;
    document.getElementById('newcountry').value = userData.city;
    document.getElementById('newaddress').value = userData.address;
   // document.getElementById('newdetails').value = userData.locationDetails;


  } catch (error) {
    console.error('Error fetching user data:', error.message);
    alert('Failed to fetch user data');
  }
}

function edit(){
  document.getElementById('saveButton').style.display = 'inline-block';
    document.getElementById('deleteButton').style.display = 'inline-block';
}
// Call the function to load user data when the page loads
document.addEventListener('DOMContentLoaded', View);

// Save user infooo

async function save(event) {
  event.preventDefault();
  console.log('Save button clicked');
  const email = document.getElementById('newemail').value;
  const newFullname = document.getElementById('newusername').value;
  const newPassword = document.getElementById('newpassword').value;
  const newPhoneNumber = document.getElementById('newnumber').value;
  const newCity = document.getElementById('newcountry').value;
  const newAddress = document.getElementById('newaddress').value;

  const bodyData = {
    newemail: email,
    newFullname: newFullname,
    newPassword: newPassword,
    newPhoneNumber: newPhoneNumber,
    newCity: newCity,
    newAddress: newAddress
  };
  
  console.log('Sending data:', bodyData);

  try {
    const response = await fetch('/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.errors ? result.errors.join(', ') : 'Failed to update user details');
    }

    alert(result.message);

    View();
  } catch (error) {
    document.getElementById('error-message').innerText = error.message;
    document.getElementById('error-message').style.display = 'block';
    console.error('Error:', error);
  }
}



async function deleteAccount() {
  const email = document.getElementById('newemail').value;

      try {
        const response = await fetch(`/delete/${email}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        alert(result.message);

        if (response.ok) {
          window.location.href = '/';
        }
      } catch (error) {
        alert('Error deleting account');
      }
}

