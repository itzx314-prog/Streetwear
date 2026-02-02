        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));

        let allProducts = [];
        let product = null;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        let selectedSize = null;
        let quantity = 1;
        let currentImageIndex = 0;

        // Load products from JSON
        async function loadProduct() {
            try {
                const response = await fetch('/products.json');
                if (!response.ok) {
                    throw new Error('Failed to load products');
                }
                allProducts = await response.json();
                product = allProducts.find(p => p.id === productId);

                if (!product) {
                    window.location.href = '../Index Page/index.html';
                    return;
                }

                displayProduct();
            } catch (error) {
                console.error('Error loading product:', error);
                document.getElementById('product-content').innerHTML = 
                    '<div class="loading">ERROR LOADING PRODUCT. Please check that products.json exists.</div>';
            }
        }

        function updateCounts() {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = cartCount;
            document.getElementById('wishlist-count').textContent = wishlist.length;
        }

        function changeImage(index) {
            currentImageIndex = index;
            document.getElementById('main-image').src = product.images[index];
            
            document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
        }

        function openLightbox(index) {
            currentImageIndex = index;
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightbox-image');
            const counterText = document.getElementById('lightbox-counter-text');
            
            lightboxImage.src = product.images[index];
            counterText.textContent = `${index + 1} / ${product.images.length}`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
            updateLightbox();
        }

        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % product.images.length;
            updateLightbox();
        }

        function updateLightbox() {
            const lightboxImage = document.getElementById('lightbox-image');
            const counterText = document.getElementById('lightbox-counter-text');
            
            lightboxImage.src = product.images[currentImageIndex];
            counterText.textContent = `${currentImageIndex + 1} / ${product.images.length}`;
        }

        // Close lightbox on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
            if (e.key === 'ArrowLeft') {
                if (document.getElementById('lightbox').classList.contains('active')) {
                    prevImage();
                }
            }
            if (e.key === 'ArrowRight') {
                if (document.getElementById('lightbox').classList.contains('active')) {
                    nextImage();
                }
            }
        });

        function displayProduct() {
            const container = document.getElementById('product-content');
            
            container.innerHTML = `
                <div class="product-layout">
                    <div class="product-image-section">
                        <div class="main-image-container">
                            <button class="wishlist-btn" id="wishlist-btn" onclick="toggleWishlist()">🤍</button>
                            <img src="${product.images[0]}" alt="${product.name}" class="main-image" id="main-image" onclick="openLightbox(0)">
                        </div>
                        <div class="thumbnail-gallery" id="thumbnail-gallery">
                            ${product.images.map((img, index) => 
                                `<img src="${img}" alt="${product.name} view ${index + 1}" 
                                      class="thumbnail ${index === 0 ? 'active' : ''}" 
                                      onclick="changeImage(${index})">`
                            ).join('')}
                        </div>
                    </div>

                    <div class="product-info-section">
                        <div class="product-category">${product.category.toUpperCase()}</div>
                        <h1>${product.name}</h1>
                        <div class="product-price">£${product.price.toFixed(2)}</div>
                        <div class="stock-indicator ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                        </div>
                        <p class="product-description">${product.description}</p>

                        <div class="size-section">
                            <h3>Select Size</h3>
                            <div class="size-options">
                                ${product.sizes.map(size => 
                                    `<button class="size-btn" onclick="selectSize('${size}')">${size}</button>`
                                ).join('')}
                            </div>
                        </div>

                        <div class="quantity-section">
                            <h3>Quantity</h3>
                            <div class="quantity-controls">
                                <button class="qty-btn" onclick="changeQuantity(-1)">-</button>
                                <span class="quantity" id="quantity">1</span>
                                <button class="qty-btn" onclick="changeQuantity(1)">+</button>
                            </div>
                        </div>

                        <div class="action-buttons">
                            <button class="add-to-cart-btn" id="add-to-cart-btn" onclick="addToCart()" ${!product.inStock ? 'disabled' : ''}>
                                ${product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('category-crumb').textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
            document.getElementById('product-crumb').textContent = product.name;

            const isWishlisted = wishlist.some(item => item.id === product.id);
            const wishlistBtn = document.getElementById('wishlist-btn');
            wishlistBtn.textContent = isWishlisted ? '❤️' : '🤍';
            wishlistBtn.className = `wishlist-btn ${isWishlisted ? 'active' : ''}`;
        }

        function selectSize(size) {
            selectedSize = size;
            document.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('selected');
                if (btn.textContent === size) {
                    btn.classList.add('selected');
                }
            });
        }

        function changeQuantity(change) {
            quantity += change;
            if (quantity < 1) quantity = 1;
            document.getElementById('quantity').textContent = quantity;
        }

        function toggleWishlist() {
            const index = wishlist.findIndex(item => item.id === product.id);

            if (index > -1) {
                wishlist.splice(index, 1);
            } else {
                wishlist.push(product);
            }

            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateCounts();
            
            const isWishlisted = wishlist.some(item => item.id === product.id);
            const wishlistBtn = document.getElementById('wishlist-btn');
            wishlistBtn.textContent = isWishlisted ? '❤️' : '🤍';
            wishlistBtn.className = `wishlist-btn ${isWishlisted ? 'active' : ''}`;
        }

        function addToCart() {
            if (!selectedSize) {
                alert('Please select a size!');
                return;
            }

            if (!product.inStock) {
                alert('Sorry, this item is out of stock!');
                return;
            }

            const existingItem = cart.find(item => item.id === product.id && item.selectedSize === selectedSize);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ ...product, quantity: quantity, selectedSize: selectedSize });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCounts();
            alert(`${product.name} (${selectedSize}) added to cart!`);
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

        loadProduct();
        updateCounts();