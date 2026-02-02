        // Load cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Update cart count
        function updateCartCount() {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = count;
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            document.getElementById('wishlist-count').textContent = wishlist.length;
        }

        // Display cart items
        function displayCart() {
            const cartContainer = document.getElementById('cart-items');
            
            if (cart.length === 0) {
                cartContainer.innerHTML = `
                    <div class="empty-cart">
                        <h3>YOUR CART IS EMPTY</h3>
                        <p>Add some fresh pieces to get started</p>
                        <a href="../Index Page/index.html" class="continue-shopping">CONTINUE SHOPPING</a>
                    </div>
                `;
                updateSummary();
                return;
            }

            cartContainer.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.images[0]}" alt="${item.name}" class="item-image">
                    <div class="item-details">
                        <div class="item-category">${item.category}</div>
                        <h3>${item.name}</h3>
                        <div class="item-price">£${item.price.toFixed(2)}</div>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                        <div class="remove-btn" onclick="removeItem(${index})">Remove</div>
                    </div>
                    <div class="item-actions">
                        <div class="item-total">£${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                </div>
            `).join('');

            updateSummary();
        }

        // Update quantity
        function updateQuantity(index, change) {
            cart[index].quantity += change;
            
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        }

        // Remove item
        function removeItem(index) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        }

        // Update order summary
        function updateSummary() {
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = subtotal > 0 ? 10 : 0;
            const tax = subtotal * 0.08;
            const total = subtotal + shipping + tax;

            document.getElementById('subtotal').textContent = `£${subtotal.toFixed(2)}`;
            document.getElementById('shipping').textContent = shipping > 0 ? `£${shipping.toFixed(2)}` : 'FREE';
            document.getElementById('tax').textContent = `£${tax.toFixed(2)}`;
            document.getElementById('total').textContent = `£${total.toFixed(2)}`;
        }
// Checkout function (If nothing is in the cart, the user cannot proceed to checkout)
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add some products before checking out.');
        return;
    }
    window.location.href = '../Checkout Page/checkout.html';
}
        // Initialize
        displayCart();
        updateCartCount();
        // Hamburger menu functionality
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });