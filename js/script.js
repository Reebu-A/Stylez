// Load products from JSON
document.addEventListener('DOMContentLoaded', function() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            displayProducts(data.products);
            setupEventListeners(data.products);
        })
        .catch(error => console.error('Error loading products:', error));
});

// Display products in the grid
function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Create badge if product is on sale or fast selling
        let badge = '';
        if (product.onSale) {
            badge = `<div class="badge">SALE</div>`;
        } else if (product.fastSelling) {
            badge = `<div class="badge">HOT</div>`;
        }
        
        // Determine stock status
        let stockStatus = '';
        if (product.stock === 0) {
            stockStatus = `<div class="product-stock out-of-stock">Out of Stock</div>`;
        } else if (product.stock <= 2) {
            stockStatus = `<div class="product-stock low-stock">Only ${product.stock} left!</div>`;
        } else {
            stockStatus = `<div class="product-stock in-stock">In Stock</div>`;
        }
        
        // Determine price display
        let priceDisplay = '';
        if (product.originalPrice) {
            priceDisplay = `
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                </div>
            `;
        } else {
            priceDisplay = `
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                </div>
            `;
        }
        
        productCard.innerHTML = `
            ${badge}
            <img src="images/${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                ${priceDisplay}
                <div class="product-code">Code: ${product.code}</div>
                ${stockStatus}
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

// Setup event listeners for filtering and searching
function setupEventListeners(products) {
    // Category filter
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Update active class
            categoryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            if (category === 'all') {
                displayProducts(products);
            } else {
                const filteredProducts = products.filter(p => p.category === category);
                displayProducts(filteredProducts);
            }
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', function() {
        performSearch(products, searchInput.value);
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch(products, searchInput.value);
        }
    });
}

// Auto-scrolling banner functionality
function initBannerSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideCount = slides.length;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        document.querySelector('.banner-slides').style.transform = `translateX(-${index * 100}%)`;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        showSlide(currentSlide);
    }
    
    // Set up auto-scroll
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    const slider = document.querySelector('.banner-slider');
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });
    
    // Category circle navigation
    document.querySelectorAll('.category-circle').forEach(circle => {
        circle.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const products = JSON.parse(localStorage.getItem('allProducts') || []);
            
            if (category === 'all') {
                displayProducts(products);
            } else {
                const filteredProducts = products.filter(p => p.category === category);
                displayProducts(filteredProducts);
            }
        });
    });
}

// Call this function in your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('allProducts', JSON.stringify(data.products));
            displayProducts(data.products);
            setupEventListeners(data.products);
            initBannerSlider(); // Initialize the banner slider
        })
        .catch(error => console.error('Error loading products:', error));
});

// Perform search
function performSearch(products, searchTerm) {
    if (!searchTerm.trim()) {
        displayProducts(products);
        return;
    }
    
    const term = searchTerm.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.code.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
    
    displayProducts(filteredProducts);
}

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // You can add additional form validation here if needed
        // Formspree will handle the submission
    });
}