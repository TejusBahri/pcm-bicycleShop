// Main JavaScript for PCM Bicycle Shop

// Global variables
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let products = [];

// DOM elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const wishlistCounts = document.querySelectorAll('.wishlist-count');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    updateWishlistCount();
    loadFeaturedProducts();
    initializeCategoryCards();
});

// Navigation functionality
function initializeNavigation() {
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Wishlist functionality
function updateWishlistCount() {
    const count = wishlist.length;
    wishlistCounts.forEach(counter => {
        counter.textContent = count;
    });
}

function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        return true;
    }
    return false;
}

function removeFromWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        return true;
    }
    return false;
}

function isInWishlist(productId) {
    return wishlist.includes(productId);
}

// Load featured products for homepage
async function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;

    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        products = await response.json();
        const featuredProducts = products.slice(0, 6); // Show first 6 products
        
        displayFeaturedProducts(featuredProducts, featuredContainer);
    } catch (error) {
        console.error('Error loading featured products:', error);
        featuredContainer.innerHTML = `
            <div class="text-center">
                <p>Unable to load products at this time.</p>
            </div>
        `;
    }
}

function displayFeaturedProducts(products, container) {
    if (!products.length) {
        container.innerHTML = '<p class="text-center">No products available.</p>';
        return;
    }

    const productsGrid = container.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-bicycle"></i>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-brand">${product.brand}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn-wishlist ${isInWishlist(product.id) ? 'active' : ''}" 
                            onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                    <a href="catalog.html" class="btn btn-primary">View Details</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize category cards
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category) {
                window.location.href = `catalog.html?category=${encodeURIComponent(category)}`;
            }
        });
    });
}

// Global wishlist toggle function
function toggleWishlist(productId) {
    if (isInWishlist(productId)) {
        removeFromWishlist(productId);
        showNotification('Product removed from wishlist', 'info');
    } else {
        addToWishlist(productId);
        showNotification('Product added to wishlist', 'success');
    }
    
    // Update button state
    const button = event.target.closest('.btn-wishlist');
    if (button) {
        button.classList.toggle('active');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: 1rem;
        }
    `;
    document.head.appendChild(style);

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);

    // Add to page
    document.body.appendChild(notification);
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other scripts
window.wishlistUtils = {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    updateWishlistCount,
    toggleWishlist
}; 