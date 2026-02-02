        // Load cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        function updateCounts() {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = cartCount;
            document.getElementById('wishlist-count').textContent = wishlist.length;
        }
        updateCounts();
        // Display order items
        function displayOrderItems() {
            const container = document.getElementById('order-items');
            
            if (cart.length === 0) {
                window.location.href = 'cart.html';
                return;
            }

            container.innerHTML = cart.map(item => `
                <div class="order-item">
                    <img src="${item.images[0]}" alt="${item.name}" class="order-item-image">
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-qty">Qty: ${item.quantity}</div>
                    </div>
                    <div class="order-item-price">£${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('');

            updateSummary();
        }

        // Update order summary
        function updateSummary() {
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = 10;
            const tax = subtotal * 0.08;
            const total = subtotal + shipping + tax;

            document.getElementById('subtotal').textContent = `£${subtotal.toFixed(2)}`;
            document.getElementById('tax').textContent = `£${tax.toFixed(2)}`;
            document.getElementById('total').textContent = `£${total.toFixed(2)}`;
        }

        // Place order
        function placeOrder() {
            const form = document.getElementById('checkout-form');
            
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Generate order number
            const orderNumber = 'ORD' + Date.now();
            
            // Store order in localStorage
            const order = {
                orderNumber: orderNumber,
                items: cart,
                total: document.getElementById('total').textContent,
                date: new Date().toISOString()
            };
            
            localStorage.setItem('lastOrder', JSON.stringify(order));
            
            // Clear cart
            localStorage.setItem('cart', JSON.stringify([]));
            
            // Redirect to confirmation
            window.location.href = 'confirmation.html';
        }

        // Initialize
        displayOrderItems();

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
        