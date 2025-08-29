// Catalog JavaScript for PCM Bicycle Shop

let allProducts = [];
let filteredProducts = [];
let currentFilters = { search: '', category: '', price: '', brand: '' };

document.addEventListener('DOMContentLoaded', function() {
    initializeCatalog();
    setupEventListeners();
    loadProducts();
});

function initializeCatalog() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        document.getElementById('category-filter').value = categoryParam;
        currentFilters.category = categoryParam;
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    ['category-filter', 'price-filter', 'brand-filter'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', handleFilterChange);
        }
    });

    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
}

async function loadProducts() {
    try {
        showLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        applyFilters();
        showLoading(false);
    } catch (error) {
        console.error('Error loading products:', error);
        showLoading(false);
        showError('Failed to load products. Please try again later.');
    }
}

function handleSearch(e) {
    currentFilters.search = e.target.value.toLowerCase();
    applyFilters();
}

function handleFilterChange(e) {
    const filterType = e.target.id.replace('-filter', '');
    currentFilters[filterType] = e.target.value;
    applyFilters();
}

function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        if (currentFilters.search && !product.name.toLowerCase().includes(currentFilters.search) && 
            !product.description.toLowerCase().includes(currentFilters.search)) {
            return false;
        }
        if (currentFilters.category && product.category !== currentFilters.category) {
            return false;
        }
        if (currentFilters.price) {
            const [min, max] = currentFilters.price.split('-').map(p => p === '+' ? Infinity : Number(p));
            if (product.price < min || (max !== Infinity && product.price > max)) {
                return false;
            }
        }
        if (currentFilters.brand && product.brand !== currentFilters.brand) {
            return false;
        }
        return true;
    });
    
    displayProducts();
    updateResultsCount();
}

function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    
    if (!productsGrid) return;
    
    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    productsGrid.style.display = 'grid';
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-bicycle"></i>
                ${product.stockStatus === 'Limited Stock' ? '<div class="product-badge">Limited</div>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-description">${product.description}</div>
                <div class="product-brand">${product.brand}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-stock">
                    <span class="stock-status ${getStockStatusClass(product.stockStatus)}">
                        ${product.stockStatus}
                    </span>
                </div>
                <div class="product-actions">
                    <button class="btn-view" onclick="viewProduct(${product.id})">View Details</button>
                    <button class="btn-wishlist ${window.wishlistUtils?.isInWishlist(product.id) ? 'active' : ''}" 
                            onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getStockStatusClass(status) {
    switch (status) {
        case 'In Stock': return 'in-stock';
        case 'Limited Stock': return 'limited-stock';
        case 'Out of Stock': return 'out-of-stock';
        default: return 'in-stock';
    }
}

async function viewProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product details');
        
        const product = await response.json();
        showProductModal(product);
    } catch (error) {
        console.error('Error loading product details:', error);
        showError('Failed to load product details.');
    }
}

function showProductModal(product) {
    const productModal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (!productModal || !modalContent) return;
    
    modalContent.innerHTML = `
        <div class="product-modal">
            <div class="modal-header">
                <h2 class="modal-title">${product.name}</h2>
                <div class="modal-category">${product.category}</div>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    <i class="fas fa-bicycle"></i>
                </div>
                <div class="modal-description">${product.description}</div>
                <div class="modal-details">
                    <div class="modal-specs">
                        <div class="spec-item">
                            <span class="spec-label">Brand:</span>
                            <span class="spec-value">${product.brand}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Category:</span>
                            <span class="spec-value">${product.category}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Stock Status:</span>
                            <span class="spec-value">${product.stockStatus}</span>
                        </div>
                    </div>
                    <div class="modal-specs">
                        <div class="spec-item">
                            <span class="spec-label">Price:</span>
                            <span class="spec-value">$${product.price.toFixed(2)}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Product ID:</span>
                            <span class="spec-value">#${product.id}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="closeProductModal()">Close</button>
                    <button class="btn-wishlist ${window.wishlistUtils?.isInWishlist(product.id) ? 'active' : ''}" 
                            onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                        ${window.wishlistUtils?.isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    productModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const productModal = document.getElementById('product-modal');
    if (productModal) {
        productModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function handleSortChange(e) {
    const sortBy = e.target.value;
    sortProducts(sortBy);
    displayProducts();
}

function sortProducts(sortBy) {
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'category':
            filteredProducts.sort((a, b) => a.category.localeCompare(b.category));
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }
}

function clearAllFilters() {
    currentFilters = { search: '', category: '', price: '', brand: '' };
    
    ['search-input', 'category-filter', 'price-filter', 'brand-filter'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    applyFilters();
}

function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = filteredProducts.length;
    }
}

function showLoading(show) {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'block' : 'none';
    }
}

function showError(message) {
    const productsGrid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    
    if (productsGrid && noResults) {
        productsGrid.style.display = 'none';
        noResults.style.display = 'block';
        noResults.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error</h3>
            <p>${message}</p>
        `;
    }
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

function toggleWishlist(productId) {
    if (window.wishlistUtils) {
        window.wishlistUtils.toggleWishlist(productId);
    }
} 