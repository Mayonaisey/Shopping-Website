document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('editUserForm').addEventListener('submit', function (event) {
        event.preventDefault(); 

        
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerHTML = '';

       
        let valid = true;
        const formData = new FormData(this);

        const name = formData.get('name').trim();
        const type = formData.get('type').trim();
        const price = formData.get('price').trim();
        const description = formData.get('description').trim();
        const quantity = formData.get('quantity').trim();

      
        const lettersOnlyPattern = /^[A-Za-z]+$/;

        if (!name) {
           alert("name is req")
            valid = false;
        } else if (!lettersOnlyPattern.test(name)) {
            alert("name must be latters ")
            valid = false;
        }

        if (!type) {
           alert("Product Type is required")
            valid = false;
        } else if (!lettersOnlyPattern.test(type)) {
           alert("Product Type must contain letters only")
            valid = false;
        }

        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            alert("Product Price must be a positive number")
            valid = false;
        }

        if (!description) {
             alert("Product Description is required")
            valid = false;
        }

        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
            alert("Product Quantity must be a positive integer")
            valid = false;
        }

        if (valid) {
            alert("add done")
            event.target.submit();
        } else {
            alert(errorMessage);
        }
    });
});
