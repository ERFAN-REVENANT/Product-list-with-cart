document.addEventListener("DOMContentLoaded", function() {
  const cart = [];
  const cartDetail = document.querySelector('.cartdetail');
  const cartCount = document.querySelector('.emptycart h1 span');
  const orderTotal = document.querySelector('.ordertotal .total');
  const confirmButton = document.querySelector('.confirm');
  const modal = document.getElementById('confirmationModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTotal = document.querySelector('.confirmed-total');
  const startNew = document.querySelector('.startnew');

  document.querySelectorAll('.add').forEach(button => {
    button.addEventListener('click', function() {
      const item = this.closest('.item');
      const name = item.querySelector('.name').textContent;
      const price = parseFloat(this.dataset.price);
      const quantityControls = item.querySelector('.quantity-controls');
      const amount = quantityControls.querySelector('.amount');
      const remove = document.querySelector('.remove');
      
      this.style.display = 'none';
      quantityControls.style.display = 'flex';
      remove.classList.add('show');

      addToCart(item, name, price, parseInt(amount.textContent));
    });
  });

  document.querySelectorAll('.increment').forEach(button => {
    button.addEventListener('click', function() {
      const item = this.closest('.item');
      const price = parseFloat(item.querySelector('.add').dataset.price);
      const amount = item.querySelector('.amount');
      amount.textContent = parseInt(amount.textContent) + 1;

      updateCart(item, price, parseInt(amount.textContent));
    });
  });

  document.querySelectorAll('.decrement').forEach(button => {
    button.addEventListener('click', function() {
      const item = this.closest('.item');
      const price = parseFloat(item.querySelector('.add').dataset.price);
      const amount = item.querySelector('.amount');
      if (parseInt(amount.textContent) > 1) {
        amount.textContent = parseInt(amount.textContent) - 1;
        updateCart(item, price, parseInt(amount.textContent));
      } else {
        item.querySelector('.add').style.display = 'block';
        item.querySelector('.quantity-controls').style.display = 'none';
        removeFromCart(item);
      }
    });
  });

  // Function to add item to cart
  function addToCart(item, name, price, quantity) {
    cart.push({ item, name, price, quantity });
    updateCartDisplay();
  }

  // Function to remove item from cart
  function removeFromCart(item) {
    const index = cart.findIndex(cartItem => cartItem.item === item);
    if (index > -1) {
      cart.splice(index, 1);
    }
    updateCartDisplay();
  }

  // Function to update cart item
  function updateCart(item, price, quantity) {
    const cartItem = cart.find(cartItem => cartItem.item === item);
    if (cartItem) {
      cartItem.quantity = quantity;
    }
    updateCartDisplay();
  }

  // Function to update cart display
  function updateCartDisplay() {
    const itemCount = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    const total = cart.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0).toFixed(2);
    const orderContainer = document.querySelector('.cartdetail .order');

    cartCount.textContent = itemCount;
    orderTotal.textContent = `$${total}`;
    
    // Clear previous cart items
    orderContainer.querySelectorAll('.cart-item').forEach(el => el.remove());

    // Add cart items to the cart detail
    cart.forEach(cartItem => {
      const cartItemEl = document.createElement('div');
      cartItemEl.classList.add('cart-item');
      cartItemEl.innerHTML = `
        <div class="left">
          <p class="name">${cartItem.name}</p>
          <div class="details">
            <p class="quantity">${cartItem.quantity}x</p>
            <p class="price-per"> @$${cartItem.price.toFixed(2)}</p>
            <p class="price-total">$${(cartItem.price * cartItem.quantity).toFixed(2)}</p>
          </div>
        </div>
        <img class="remove" src="./assets/images/icon-remove-item.svg" alt="Remove item">
      `;

      // Remove item event
      cartItemEl.querySelector('.remove').addEventListener('click', () => {
        removeFromCart(cartItem.item);
        cartItem.item.querySelector('.add').style.display = 'block';
        cartItem.item.querySelector('.quantity-controls').style.display = 'none';
      });

      orderContainer.insertBefore(cartItemEl, orderContainer.querySelector('.ordertotal'));
    });

    if (itemCount > 0) {
      cartDetail.style.display = 'block';
      document.querySelector('.emptycart').style.display = 'none';
    } else {
      cartDetail.style.display = 'none';
      document.querySelector('.emptycart').style.display = 'block';
    }
  }

  // Event listener for Confirm Order button
  confirmButton.addEventListener('click', function() {
    // Show modal and overlay
    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
    modalTotal.textContent = orderTotal.textContent;
    
    // Populate modal with order summary
    const orderSummary = document.querySelector('.modal-content .order-summary');
    orderSummary.innerHTML = '';

    cart.forEach(cartItem => {
      const itemSummary = document.createElement('div');
      itemSummary.classList.add('item-summary');
      itemSummary.innerHTML = `
        <div class="left">
          <p class="name">${cartItem.name}</p>
          <div class="details">
            <p class="quantity">${cartItem.quantity}x</p>
            <p class="price-per"> @$${cartItem.price.toFixed(2)}</p>
            <p class="price-total">$${(cartItem.price * cartItem.quantity).toFixed(2)}</p>
          </div>
        </div>
      `;
      orderSummary.appendChild(itemSummary);
    });
  });

  // Event listener for Start New Order button
  startNew.addEventListener('click', function() {
    // Hide modal and overlay
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
    
    // Clear cart
    cart.length = 0;
    updateCartDisplay();
  });
});
