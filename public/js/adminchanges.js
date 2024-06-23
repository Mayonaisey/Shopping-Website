document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('newProductForm').addEventListener('submit', function (event) {
        
        event.preventDefault();
        let valid = true;

        const name = document.getElementById('name').value.trim();
        const type = document.getElementById('type').value.trim();
        const price = document.getElementById('price').value.trim();
        const description = document.getElementById('description').value.trim();
        const quantity = document.getElementById('quantity').value.trim();

        const lettersOnlyPattern = /^[A-Za-z]+$/;

        if (!name) {
            alert('Product Name is required.');
            valid = false;
        } else if (!lettersOnlyPattern.test(name)) {
            alert('Product Name must contain letters only.');
            valid = false;
        }

        if (!type) {
            alert('Product Type is required.');
            valid = false;
        } else if (!lettersOnlyPattern.test(type)) {
            alert('Product Type must contain letters only.');
            valid = false;
        }


        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            alert('Product Price must be a positive number.');
            valid = false;
        }

        if (!description) {
            alert('Product Description is required.');
            valid = false;
        }

        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
            alert('Product Quantity must be a positive integer.');
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