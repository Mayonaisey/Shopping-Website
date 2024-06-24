document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let fullname = document.getElementById('fullname').value.trim();
    let phoneNumber = document.getElementById('phone').value.trim();
    let city = document.getElementById('city').value.trim();
    let address = document.getElementById('address').value.trim();
    let locationDetails = document.getElementById('locationDetails').value.trim();
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();

    let valid = true;
    let errorMessage = "";

    if (fullname === "") {
    errorMessage += "Full Name is required.\n";
    valid = false;
} else if (!/^[A-Za-z ]+$/.test(fullname)) {
    errorMessage += "Full Name must contain only letters and spaces.\n";
    valid = false;
}

if (city === "") {
    errorMessage += "City is required.\n";
    valid = false;
} else if (!/^[A-Za-z ]+$/.test(city)) {
    errorMessage += "City must contain only letters and spaces.\n";
    valid = false;
}
    if (phoneNumber === "" || !/^\d{11}$/.test(phoneNumber)) {
        errorMessage += "Valid Phone Number is required (10 digits).\n";
        valid = false;
    }

   

    if (address === "") {
        errorMessage += "Address is required.\n";
        valid = false;
    }

    if (locationDetails === "") {
        errorMessage += "Location Details are required.\n";
        valid = false;
    }

    if (email === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorMessage += "Valid Email is required.\n";
        valid = false;
    }

    if (password === "" || password.length < 6) {
        errorMessage += "Password is required (at least 6 characters).\n";
        valid = false;
    }

    if (valid) {
        alert("user saved")
        event.target.submit();
    } else {
        alert(errorMessage);
    }
});