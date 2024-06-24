// wishlist.js

async function removeItem(itemId) {
  try {
    const response = await fetch(`/wishlist/${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove item from wishlist');
    }

    const result = await response.json();
    console.log(result.message);

    // Remove the item from the DOM
    const itemDiv = document.querySelector(`.itemdiv[data-id="${itemId}"]`);
    if (itemDiv) {
      itemDiv.remove();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
