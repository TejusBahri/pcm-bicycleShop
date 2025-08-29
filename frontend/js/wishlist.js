// Wishlist JavaScript for PCM Bicycle Shop

document.addEventListener('DOMContentLoaded', function() {
    loadWishlist();
    setupEventListeners();
});

function setupEventListeners() {
    const clearWishlistBtn = document.getElementById('clear-wishlist');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', clearAllWishlist);
    }
}

async function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
        showEmptyWishlist();
        return;
    }
    
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const allProducts = await response.json();
        const wishlistProducts = allProducts.filter(product => wishlist.includes(product.id));
        
        displayWishlist(wishlistProducts);
        loadRecommendations(allProducts, wishlistProducts);
    } catch (error) {
        console.error('Error loading wishlist:', error);
        showError('Failed to load wishlist. Please try again later.');
    }
}

function displayWishlist(products) {
    const emptyWishlist = document.getElementById('empty-wishlist');
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistGrid = document.getElementById('wishlist-grid');
    const wishlistCount = document.getElementById('wishlist-count');
    
    if (!emptyWishlist || !wishlistItems || !wishlistGrid || !wishlistCount) return;
    
    emptyWishlist.style.display = 'none';
    wishlistItems.style.display = 'block';
    wishlistCount.textContent = products.length;
    
    wishlistGrid.innerHTML = products.map(product => `
        <div class="wishlist-item">
            <div class="wishlist-item-image">
                <i class="fas fa-bicycle"></i>
                <button class="remove-wishlist" onclick="removeFromWishlist(${product.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="wishlist-item-info">
                <h3 class="wishlist-item-name">${product.name}</h3>
                <div class="wishlist-item-price">$${product.price.toFixed(2)}</div>
                <div class="wishlist-item-actions">
                    <button class="btn-view-details" onclick="viewProduct(${product.id})">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadRecommendations(allProducts, wishlistProducts) {
    const recommendationsSection = document.getElementById('recommendations-section');
    const recommendationsGrid = document.getElementById('recommendations-grid');
    
    if (!recommendationsSection || !recommendationsGrid) return;
    
    // Get products not in wishlist
    const wishlistIds = wishlistProducts.map(p => p.id);
    const recommendations = allProducts
        .filter(product => !wishlistIds.includes(product.id))
        .slice(0, 4); // Show 4 recommendations
    
    if (recommendations.length > 0) {
        recommendationsSection.style.display = 'block';
        recommendationsGrid.innerHTML = recommendations.map(product => `
            <div class="recommendation-card">
                <div class="recommendation-image">
                    <i class="fas fa-bicycle"></i>
                </div>
                <div class="recommendation-info">
                    <h3 class="recommendation-name">${product.name}</h3>
                    <div class="recommendation-brand">${product.brand}</div>
                    <div class="recommendation-price">$${product.price.toFixed(2)}</div>
                    <div class="recommendation-actions">
                        <button class="btn-add-wishlist" onclick="addToWishlist(${product.id})">
                            <i class="fas fa-heart"></i> Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function removeFromWishlist(productId) {
    if (window.wishlistUtils) {
        window.wishlistUtils.removeFromWishlist(productId);
        loadWishlist(); // Reload the wishlist
    }
}

function addToWishlist(productId) {
    if (window.wishlistUtils) {
        window.wishlistUtils.addToWishlist(productId);
        loadWishlist(); // Reload the wishlist
    }
}

function clearAllWishlist() {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        localStorage.removeItem('wishlist');
        showEmptyWishlist();
        
        // Update wishlist count in navigation
        if (window.wishlistUtils) {
            window.wishlistUtils.updateWishlistCount();
        }
    }
}

function showEmptyWishlist() {
    const emptyWishlist = document.getElementById('empty-wishlist');
    const wishlistItems = document.getElementById('wishlist-items');
    const recommendationsSection = document.getElementById('recommendations-section');
    
    if (emptyWishlist) emptyWishlist.style.display = 'block';
    if (wishlistItems) wishlistItems.style.display = 'none';
    if (recommendationsSection) recommendationsSection.style.display = 'none';
}

function showError(message) {
    const emptyWishlist = document.getElementById('empty-wishlist');
    if (emptyWishlist) {
        emptyWishlist.innerHTML = `
            <div class="empty-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2>Error</h2>
            <p>${message}</p>
        `;
    }
}

function viewProduct(productId) {
    // Redirect to catalog page with product modal
    window.location.href = `catalog.html?product=${productId}`;
} 