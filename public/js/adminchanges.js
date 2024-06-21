
document.getElementById('newProductForm').addEventListener('submit', function(event) {
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value, 10);

  
    if (price < 0) {
        alert('Price must be a positive number.');
       
        return;
    }

    if (quantity < 0) {
        alert('Quantity  be a positive integer.');
        
        return;
    }
});
