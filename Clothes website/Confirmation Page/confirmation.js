        // Load order from localStorage
        const order = JSON.parse(localStorage.getItem('lastOrder'));

        if (!order) {
            window.location.href = 'index.html';
        } else {
            // Display order number
            document.getElementById('order-number').textContent = order.orderNumber;
            
            // Display order items
            const itemsContainer = document.getElementById('order-items');
            itemsContainer.innerHTML = order.items.map(item => `
                <div class="order-item">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-qty">Quantity: ${item.quantity}</div>
                    </div>
                    <div class="item-price">£${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('');

            // Display total
            document.getElementById('order-total').textContent = order.total;
        }

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