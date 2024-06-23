
 
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
// Update user data
        document.getElementById('userFullName').textContent = userData.fullname;
        document.getElementById('welcomeuser').textContent = userData.fullname;


document.getElementById('newusername').value = userData.fullname;
        document.getElementById('newemail').value = userData.email;
        document.getElementById('newnumber').value = userData.phoneNumber;
        document.getElementById('newcountry').value = userData.city;
        document.getElementById('newaddress').value = userData.address;
        document.getElementById('newdetails').value = userData.locationDetails;

        document.getElementById('saveButton').style.display = 'inline-block';
        document.getElementById('deleteButton').style.display = 'inline-block';


  } catch (error) {
    console.error('Error fetching user data:', error.message);
    alert('Failed to fetch user data');
  }
}


// Save user infooo
async function save() {
  const email = document.getElementById('newemail').value;
  const newFullname = document.getElementById('newusername').value;
  const newPassword = document.getElementById('newpassword').value;
  const newPhoneNumber = document.getElementById('newnumber').value;
  const newCity = document.getElementById('newcountry').value;
  const newAddress = document.getElementById('newaddress').value;
  const newLocationDetails = document.getElementById('newdetails').value;

  const bodyData = {
    email,
    newFullname,
    newPassword,
    newPhoneNumber,
    newCity,
    newAddress,
    newLocationDetails
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

    if (!response.ok) {
      throw new Error('Failed to update user details');
    }

    const result = await response.json();
    alert(result.message);

    // Refresh the view with the updated data
    View();
  } catch (error) {
    alert('Error saving user details');
    console.error(error);
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