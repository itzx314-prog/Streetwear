     let allProducts = [];
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        // Load products from JSON file
        async function loadProducts() {
            try {
            const response = await fetch('../products.json');
         if (!response.ok) {
            throw new Error('Failed to load products');
            }
            allProducts = await response.json();
            displayWishlist();
            updateCounts();
            } catch (error) {
            console.error('Error loading products:', error);
            }
        }

        // Update counts
        function updateCounts() {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = cartCount;
            document.getElementById('wishlist-count').textContent = wishlist.length;
        }

        // Get stock badge HTML
        function getStockBadge(inStock) {
            if (inStock) {
                return '<div class="stock-badge in-stock">IN STOCK</div>';
            } else {
                return '<div class="stock-badge">OUT OF STOCK</div>';
            }
        }

        // Display wishlist
        function displayWishlist() {
            const container = document.getElementById('wishlist-container');
            
            if (wishlist.length === 0) {
                container.innerHTML = `
                    <div class="empty-wishlist">
                        <h3>YOUR WISHLIST IS EMPTY</h3>
                        <p>Save your favorite items here for later</p>
                        <a href="../Index Page/index.html" class="continue-shopping">CONTINUE SHOPPING</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="products-grid">
                    ${wishlist.map(product => `
                        <div class="product-card" onclick="viewProduct(${product.id})">
                            ${getStockBadge(product.inStock)}
                            <button class="remove-btn" onclick="event.stopPropagation(); removeFromWishlist(${product.id})">
                                ❌
                            </button>
                            <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                            <div class="product-info">
                                <div class="product-category">${product.category}</div>
                                <div class="product-name">${product.name}</div>
                                <div class="product-price">£${product.price.toFixed(2)}</div>
                                <div class="product-actions">
                                    <button class="view-details-btn" onclick="event.stopPropagation(); viewProduct(${product.id})">VIEW</button>
                                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                                    ${product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // View product
        function viewProduct(productId) {
            window.location.href = `../Product Page/product.html?id=${productId}`;
        }

        // Remove from wishlist
        function removeFromWishlist(productId) {
            wishlist = wishlist.filter(item => item.id !== productId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateCounts();
            displayWishlist();
        }

        // Add to cart
        function addToCart(productId) {
            const product = allProducts.find(p => p.id === productId);
    
            if (!product.inStock) {
            alert('Sorry, this item is out of stock!');
            return;
            } else {

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
            existingItem.quantity++;
            } else {
            cart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCounts();
            alert(`${product.name} added to cart!`);
            }
        }

        // Initialize - Load products from JSON
        loadProducts();

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