        // Global products array - will be loaded from JSON
        let allProducts = [];
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        let currentProducts = [];

        // Load products from JSON file
        async function loadProducts() {
            try {
                const response = await fetch('../products.json'); // ← Change this to your JSON file path
                if (!response.ok) {
                    throw new Error('Failed to load products');
                }
                allProducts = await response.json();
                currentProducts = [...allProducts];
                displayProducts(currentProducts);
                displayRecentlyViewed();
            } catch (error) {
                console.error('Error loading products:', error);
                document.getElementById('products-container').innerHTML = 
                    '<div class="loading">ERROR LOADING PRODUCTS. Please check that products.json exists.</div>';
            }
        }

        function updateCounts() {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = cartCount;
            document.getElementById('wishlist-count').textContent = wishlist.length;
        }

        function getStockBadge(inStock) {
            if (inStock) {
                return '<div class="stock-badge">IN STOCK</div>';
            } else {
                return '<div class="stock-badge out-of-stock">OUT OF STOCK</div>';
            }
        }

        function displayProducts(products) {
            const container = document.getElementById('products-container');
            
            if (products.length === 0) {
                container.innerHTML = '<div class="loading">NO PRODUCTS FOUND</div>';
                return;
            }

            container.innerHTML = products.map(product => {
                const isWishlisted = wishlist.some(item => item.id === product.id);
                return `
                <div class="product-card" onclick="viewProduct(${product.id})">
                    ${getStockBadge(product.inStock)}
                    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                        ${isWishlisted ? '❤️' : '🤍'}
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
            `}).join('');
        }

        function viewProduct(productId) {
            const product = allProducts.find(p => p.id === productId);
            
            recentlyViewed = recentlyViewed.filter(p => p.id !== productId);
            recentlyViewed.unshift(product);
            recentlyViewed = recentlyViewed.slice(0, 4);
            
            localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
            window.location.href = `../Product Page/product.html?id=${productId}`;
        }

        function displayRecentlyViewed() {
            if (recentlyViewed.length === 0) {
                document.getElementById('recently-viewed-section').style.display = 'none';
                return;
            }

            document.getElementById('recently-viewed-section').style.display = 'block';
            const container = document.getElementById('recently-viewed-container');
            
            container.innerHTML = recentlyViewed.map(product => {
                const isWishlisted = wishlist.some(item => item.id === product.id);
                return `
                <div class="product-card" onclick="viewProduct(${product.id})">
                    ${getStockBadge(product.inStock)}
                    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                        ${isWishlisted ? '❤️' : '🤍'}
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
            `}).join('');
        }

        function toggleWishlist(productId) {
            const product = allProducts.find(p => p.id === productId);
            const index = wishlist.findIndex(item => item.id === productId);

            if (index > -1) {
                wishlist.splice(index, 1);
            } else {
                wishlist.push(product);
            }

            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateCounts();
            displayProducts(currentProducts);
            displayRecentlyViewed();
        }

        function addToCart(productId) {
            const product = allProducts.find(p => p.id === productId);
            
            if (!product.inStock) {
                alert('Sorry, this item is out of stock!');
                return;
            }

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

        function sortProducts(products, sortBy) {
            const sorted = [...products];
            
            switch(sortBy) {
                case 'price-low':
                    return sorted.sort((a, b) => a.price - b.price);
                case 'price-high':
                    return sorted.sort((a, b) => b.price - a.price);
                case 'name-asc':
                    return sorted.sort((a, b) => a.name.localeCompare(b.name));
                case 'name-desc':
                    return sorted.sort((a, b) => b.name.localeCompare(a.name));
                default:
                    return sorted;
            }
        }

        // Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                let filtered = category === 'all' 
                    ? allProducts 
                    : allProducts.filter(p => p.category === category);
                
                const sortBy = document.getElementById('sort-select').value;
                currentProducts = sortProducts(filtered, sortBy);
                displayProducts(currentProducts);
            });
        });

        // Sort functionality
        document.getElementById('sort-select').addEventListener('change', (e) => {
            currentProducts = sortProducts(currentProducts, e.target.value);
            displayProducts(currentProducts);
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
            currentProducts = filtered;
            displayProducts(currentProducts);
        });

        // Initialize - Load products from JSON
        loadProducts();
        updateCounts();

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