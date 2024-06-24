const { response } = require("express");
const { post } = require("../../routes/checkoutRoute");    
    function passValue() {
      const grandInput = document.getElementById("grand");
      const newValue = grandInput.value;
      sessionStorage.setItem("newValue", newValue);
    }
    document.addEventListener('DOMContentLoaded',()=>{
      const plusButtons=document.querySelectorAll('.plus');
      const minusButtons=document.querySelectorAll('.min');

      plusButtons.forEach(button=>{
        button.addEventListener('click',()=>handlePlusClick(button));
      });
      minusButtons.forEach(button=>{
        button.addEventListener('click',()=>handlePlusClick(button));
      });
      if (alertElement) {
        setTimeout(() => {
          alertElement.style.display = 'none';
        }, 3000); // Adjust the timeout duration as needed
      };
      const handlePlusClick=async(button)=>{
        const quantityInput=button.parentElement.querySelector('.qy');
        let quantity=parseInt(quantityInput.value);
       // if(quantity<//max quanitiy)
        quantity++;
        quantityInput.value=quantity;
        //const id=button.closest('.listcart').querySelector('.delete').getAtr
        const itemId=button.parentElement.dataset.itemId;
        await updateCart(itemId,quantity);
       updatePrices();
      };
      const handleMinsClick=async(button)=>{
        const quantityInput=button.parentElement.querySelector('.qy');
        let quantity=parseInt(quantityInput.value);
        if(quantity>1){
        quantity--;
        quantityInput.value=quantity;
        const itemId=button.parentElement.dataset.itemId;
       await updateCart(itemId,quantity);
       updatePrices();
      }
      };
      const updateCart=async(id,quantity)=>{
        try{
          const response =await fetch('/cart/update/${id}',{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({quantity})
          });
          if(response.ok){
            const result=await response.json();
            updatePrices();
          }
        }catch(err){
          console.error('Error updating cart:', error);
        }
      };
      const updatePrices=()=>{
        const totalPriceElement=document.getElementById('Tprice');
        const grandTotalElement=document.getElementById('grand');
        const items=document.querySelectorAll('.listcart');
        let totalPrice=0;
        items.forEach(item=>{
          const priceElement=item.querySelector('.pr');
          const quantityElement=item.querySelector('.qy');
          const price=parseFloat(priceElement.value.replace('EGP',' '));
          const quantity =parseInt(quantityElement.value);
          totalPrice+=price*quantity;
        });
        totalPriceElement.value=totalPrice.toFixed(2)+'EGP';
        grandTotalElement.value=(totalPrice*0.9).toFixed(2)+'EGP';
      };
     
    });