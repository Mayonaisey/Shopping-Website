
 
  var products = document.getElementsByClassName("listcart");
  updatePrice();
    function updatePrice() {
      var total = 0;
      var grandTotal = 0;
      Array.from(products).forEach(product => {
        var quantityInput = product.querySelector(".qy");
        var priceElement = product.querySelector(".pr").value.replace(' EGP', '');
        var price = parseFloat(priceElement);
        var quantity = parseInt(quantityInput.value);
        total += price * quantity;
      });
      document.getElementById("Tprice").value = total.toFixed(2) + " EGP";
      var discountRate = parseFloat(document.getElementById("dis").value.replace('%', '')) / 100;
      grandTotal = total - (total * discountRate);
      document.getElementById("grand").value = grandTotal.toFixed(2) + " EGP";
    }
    
    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      var plusButton = product.querySelector(".plus");
      var minusButton = product.querySelector(".min");
      var deleteButton = product.querySelector(".delete");
      plusButton.addEventListener("click", createPlusFunction(product));
      minusButton.addEventListener("click", createMinusFunction(product));
      deleteButton.addEventListener("click", createDeleteFunction(product));
    }
    
    function createPlusFunction(product) {
      return function () {
        var input = product.querySelector(".qy");
        input.value = parseInt(input.value) + 1;
        updatePrice();
      };
    }
    
    function createMinusFunction(product) {
      return function () {
        var input = product.querySelector(".qy");
        var current = parseInt(input.value);
        if (current > 1) {
          input.value = current - 1;
          updatePrice();
        }
      };
    }
    
    function createDeleteFunction(product) {
      return function () {
        product.parentNode.removeChild(product);
        updatePrice();
      };
    }
    
    function passValue() {
      const grandInput = document.getElementById("grand");
      const newValue = grandInput.value;
      sessionStorage.setItem("newValue", newValue);
    }