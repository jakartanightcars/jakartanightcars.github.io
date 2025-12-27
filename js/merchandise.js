const orderForm = document.getElementById('orderForm');
const orderButton = document.getElementById('orderButton');
const sizeGuideModal = document.getElementById('sizeGuide');
const orderSuccessModal = document.getElementById('orderSuccess');
const closeModals = document.querySelectorAll('.close-modal');
const sizeButtons = document.querySelectorAll('.size-btn');
const qtyMinus = document.querySelector('.qty-btn.minus');
const qtyPlus = document.querySelector('.qty-btn.plus');
const qtyDisplay = document.querySelector('.qty');
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('mainImage');
const sizeGuideLink = document.querySelector('.size-guide-link a');

const basePrice = 250000;
const shippingCost = 15000;
const taxRate = 0.1;
let quantity = 1;
let selectedSize = 'M';

function init() {
    sizeButtons.forEach(btn => {
        if (btn.dataset.size === selectedSize) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', handleSizeSelection);
    });
    
    updateOrderSummary();
}

function handleSizeSelection(e) {
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    
    const button = e.target;
    button.classList.add('active');
    selectedSize = button.dataset.size;
    
    updateOrderSummary();
}

function updateQuantity(change) {
    quantity = Math.max(1, Math.min(quantity + change, 10));
    qtyDisplay.textContent = quantity;
    updateOrderSummary();
}

function updateOrderSummary() {
    const subtotal = basePrice * quantity;
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;
    
    document.getElementById('itemPrice').textContent = formatCurrency(subtotal);
    document.getElementById('taxPrice').textContent = formatCurrency(tax);
    document.getElementById('totalPrice').textContent = formatCurrency(total);
    
    orderButton.innerHTML = `<i class="fas fa-lock"></i> Place Order - ${formatCurrency(total)}`;
    
    const itemPriceText = document.getElementById('itemPrice').parentNode;
    itemPriceText.querySelector('span:first-child').textContent = `Hoodie (${selectedSize})`;
}

function formatCurrency(amount) {
    return 'IDR ' + amount.toLocaleString('id-ID');
}

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        
        thumbnail.classList.add('active');
        
        const imageUrl = thumbnail.dataset.image;
        mainImage.src = imageUrl;
        mainImage.alt = thumbnail.querySelector('img').alt;
    });
});

function showModal(modal) {
    modal.style.display = 'flex';
    
    if (modal === orderSuccessModal) {
        document.getElementById('orderedSize').textContent = selectedSize;
        document.getElementById('orderedQty').textContent = quantity;
        
        const subtotal = basePrice * quantity;
        const tax = subtotal * taxRate;
        const total = subtotal + shippingCost + tax;
        
        document.getElementById('orderedTotal').textContent = formatCurrency(total);
        document.getElementById('orderedPayment').textContent = 
            document.getElementById('paymentMethod').value === 'qris' ? 'QRIS' : 
            document.getElementById('paymentMethod').value === 'bank_transfer' ? 'Bank Transfer' : 'COD';
        
        document.getElementById('orderNumber').textContent = 
            `JNC-HOODIE-${Date.now().toString().slice(-6)}`;
    }
}

function hideModal(modal) {
    modal.style.display = 'none';
}

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!orderForm.checkValidity()) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        province: document.getElementById('province').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        notes: document.getElementById('notes').value,
        size: selectedSize,
        quantity: quantity,
        total: basePrice * quantity + shippingCost + (basePrice * quantity * taxRate),
        timestamp: new Date().toISOString()
    };
    
    console.log('Order submitted:', formData);

    const orderId = `JNC-HOODIE-${Date.now().toString().slice(-6)}`;
    localStorage.setItem(orderId, JSON.stringify(formData));
    
    showModal(orderSuccessModal);
});

qtyMinus.addEventListener('click', () => updateQuantity(-1));
qtyPlus.addEventListener('click', () => updateQuantity(1));

sizeGuideLink.addEventListener('click', (e) => {
    e.preventDefault();
    showModal(sizeGuideModal);
});

closeModals.forEach(btn => {
    btn.addEventListener('click', () => {
        hideModal(sizeGuideModal);
        hideModal(orderSuccessModal);
    });
});

window.addEventListener('click', (e) => {
    if (e.target === sizeGuideModal) {
        hideModal(sizeGuideModal);
    }
    if (e.target === orderSuccessModal) {
        hideModal(orderSuccessModal);
    }
});

init();