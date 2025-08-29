// Contact JavaScript for PCM Bicycle Shop

document.addEventListener('DOMContentLoaded', function() {
    loadShopInfo();
    initializeFAQ();
});

async function loadShopInfo() {
    try {
        const response = await fetch('/api/contact');
        if (!response.ok) throw new Error('Failed to fetch shop information');
        
        const shopInfo = await response.json();
        displayShopInfo(shopInfo);
    } catch (error) {
        console.error('Error loading shop information:', error);
        showDefaultShopInfo();
    }
}

function displayShopInfo(shopInfo) {
    // Update contact cards
    const shopAddress = document.getElementById('shop-address');
    const shopPhone = document.getElementById('shop-phone');
    const shopEmail = document.getElementById('shop-email');
    const shopHours = document.getElementById('shop-hours');
    
    if (shopAddress) shopAddress.textContent = shopInfo.address;
    if (shopPhone) shopPhone.textContent = shopInfo.phone;
    if (shopEmail) shopEmail.textContent = shopInfo.email;
    if (shopHours) shopHours.textContent = shopInfo.hours;
    
    // Update footer contact info
    const footerAddress = document.querySelector('.footer-section p:first-child');
    const footerPhone = document.querySelector('.footer-section p:nth-child(2)');
    const footerEmail = document.querySelector('.footer-section p:nth-child(3)');
    
    if (footerAddress) footerAddress.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${shopInfo.address}`;
    if (footerPhone) footerPhone.innerHTML = `<i class="fas fa-phone"></i> ${shopInfo.phone}`;
    if (footerEmail) footerEmail.innerHTML = `<i class="fas fa-envelope"></i> ${shopInfo.email}`;
}

function showDefaultShopInfo() {
    const defaultInfo = {
        address: '123 Cycling Street, Downtown, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'info@pcmbikes.com',
        hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-6PM, Sun: 10AM-5PM'
    };
    
    displayShopInfo(defaultInfo);
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
} 