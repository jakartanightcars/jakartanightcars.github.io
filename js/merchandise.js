const checkoutForm = document.getElementById('checkoutForm');
const payButton = document.getElementById('payButton');
const sizeButtons = document.querySelectorAll('.size-btn');
const qtyMinus = document.querySelector('.qty-btn.minus');
const qtyPlus = document.querySelector('.qty-btn.plus');
const qtyDisplay = document.querySelector('.qty');
const paymentModal = document.getElementById('paymentModal');
const closeModal = document.getElementById('closeModal');
const successState = document.getElementById('successState');
const pendingState = document.getElementById('pendingState');
const errorState = document.getElementById('errorState');
const loadingState = document.getElementById('loadingState');
const downloadReceipt = document.getElementById('downloadReceipt');
const continueShopping = document.getElementById('continueShopping');
const closePending = document.getElementById('closePending');
const retryPayment = document.getElementById('retryPayment');
const changePayment = document.getElementById('changePayment');

const basePrice = 250000;
const shippingCost = 25000;
const taxRate = 0.1;
let quantity = 1;
let selectedSize = 'M';
let isProcessing = false;

function init() {
    sizeButtons.forEach(btn => {
        if (btn.dataset.size === selectedSize) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', handleSizeSelection);
    });
    
    updateOrderSummary();
    setupEventListeners();
    initModal();
}

function handleSizeSelection(e) {
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    const button = e.target;
    button.classList.add('active');
    selectedSize = button.dataset.size;
}

function updateQuantity(change) {
    quantity = Math.max(1, Math.min(quantity + change, 10));
    if (qtyDisplay) {
        qtyDisplay.textContent = quantity;
    }
    updateOrderSummary();
}

function updateOrderSummary() {
    const subtotal = basePrice * quantity;
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;
    
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    if (taxElement) taxElement.textContent = formatCurrency(tax);
    if (totalElement) totalElement.textContent = formatCurrency(total);
    
    if (payButton) {
        payButton.innerHTML = `<i class="fas fa-qrcode"></i> Pay ${formatCurrency(total)}`;
    }
}

function formatCurrency(amount) {
    return 'IDR ' + amount.toLocaleString('id-ID');
}

function showLoading(button) {
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Processing...';
        isProcessing = true;
    }
}

function hideLoading(button, originalText) {
    if (button) {
        button.disabled = false;
        button.innerHTML = originalText;
        isProcessing = false;
    }
}

function validateFormData(formData) {
    const errors = [];
    
    if (!formData.fullName?.trim()) errors.push('Full name is required');
    if (!formData.email?.trim()) errors.push('Email is required');
    if (!formData.phone?.trim()) errors.push('Phone number is required');
    if (!formData.address?.trim()) errors.push('Address is required');
    if (!formData.city?.trim()) errors.push('City is required');
    if (!formData.postalCode?.trim()) errors.push('Postal code is required');
    if (!formData.province?.trim()) errors.push('Province is required');
    if (!formData.terms) errors.push('You must agree to the terms and conditions');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
        errors.push('Please enter a valid Indonesian phone number (e.g., 08123456789)');
    }
    
    return errors;
}

function resetLoadingState() {
    const total = basePrice * quantity + shippingCost + (basePrice * quantity * taxRate);
    hideLoading(payButton, `<i class="fas fa-qrcode"></i> Pay ${formatCurrency(total)}`);
    isProcessing = false;
}

async function processPayment(formData) {
    try {
        showLoadingModal();
        
        const subtotal = basePrice * quantity;
        const tax = subtotal * taxRate;
        const total = subtotal + shippingCost + tax;
        
        const paymentData = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            province: formData.province,
            notes: formData.notes || '',
            terms: 'true',
            productName: 'JNC Night Glow T-Shirt',
            productPrice: basePrice,
            size: selectedSize,
            quantity: quantity
        };
        
        console.log(paymentData)
        
    } catch (error) {
        showPaymentError({
            error_message: error.message || 'Payment processing failed'
        });
        resetLoadingState();
        throw error;
    }
}

function initModal() {
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closePaymentModal();
            resetLoadingState();
        });
    }
    
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            closePaymentModal();
            resetLoadingState();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && paymentModal.classList.contains('active')) {
            closePaymentModal();
            resetLoadingState();
        }
    });
    
    if (continueShopping) {
        continueShopping.addEventListener('click', () => {
            closePaymentModal();
            window.location.href = 'index.html#merchandise';
        });
    }
    
    if (closePending) {
        closePending.addEventListener('click', function() {
            closePaymentModal();
            resetLoadingState();
        });
    }
    
    if (retryPayment) {
        retryPayment.addEventListener('click', () => {
            closePaymentModal();
            resetLoadingState();
            setTimeout(() => {
                if (checkoutForm) {
                    checkoutForm.dispatchEvent(new Event('submit'));
                }
            }, 500);
        });
    }
    
    if (changePayment) {
        changePayment.addEventListener('click', () => {
            closePaymentModal();
            resetLoadingState();
            const paymentOptions = document.querySelector('.payment-options');
            if (paymentOptions) {
                paymentOptions.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (downloadReceipt) {
        downloadReceipt.addEventListener('click', downloadPaymentReceipt);
    }
}

function showPaymentModal() {
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    paymentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    const states = [successState, pendingState, errorState, loadingState];
    states.forEach(state => {
        if (state) state.classList.add('hidden');
    });
    if (loadingState) loadingState.classList.remove('hidden');
}

function showLoadingModal() {
    showPaymentModal();
    if (loadingState) loadingState.classList.remove('hidden');
    const states = [successState, pendingState, errorState];
    states.forEach(state => {
        if (state) state.classList.add('hidden');
    });
}

function showPaymentSuccess(result) {
    if (successState) {
        const orderIdEl = document.getElementById('successOrderId');
        const transactionIdEl = document.getElementById('successTransactionId');
        const amountEl = document.getElementById('successAmount');
        const paymentMethodEl = document.getElementById('successPaymentMethod');
        
        if (orderIdEl) orderIdEl.textContent = result.order_id || '-';
        if (transactionIdEl) transactionIdEl.textContent = result.transaction_id || '-';
        if (amountEl) {
            const amount = result.gross_amount || (basePrice * quantity + shippingCost + (basePrice * quantity * taxRate));
            amountEl.textContent = formatCurrency(amount);
        }
        if (paymentMethodEl) paymentMethodEl.textContent = result.payment_type || 'QRIS';
        
        successState.classList.remove('hidden');
        loadingState.classList.add('hidden');
    }
    
    resetCheckoutForm();
}

function showPaymentPending(result) {
    if (pendingState) {
        const orderIdEl = document.getElementById('pendingOrderId');
        const transactionIdEl = document.getElementById('pendingTransactionId');
        const amountEl = document.getElementById('pendingAmount');
        
        if (orderIdEl) orderIdEl.textContent = result.order_id || '-';
        if (transactionIdEl) transactionIdEl.textContent = result.transaction_id || '-';
        if (amountEl) {
            const amount = result.gross_amount || (basePrice * quantity + shippingCost + (basePrice * quantity * taxRate));
            amountEl.textContent = formatCurrency(amount);
        }
        
        pendingState.classList.remove('hidden');
        loadingState.classList.add('hidden');
    }
}

function showPaymentError(result) {
    if (errorState) {
        const orderIdEl = document.getElementById('errorOrderId');
        const errorMessageEl = document.getElementById('errorMessage');
        
        if (orderIdEl) orderIdEl.textContent = result.order_id || '-';
        if (errorMessageEl) {
            errorMessageEl.textContent = result.status_message || result.error_message || 'Unknown error occurred';
        }
        
        errorState.classList.remove('hidden');
        loadingState.classList.add('hidden');
    }
    
    resetLoadingState();
}

function downloadPaymentReceipt() {
    const receiptBtn = document.getElementById('downloadReceipt');
    if (receiptBtn) {
        const originalText = receiptBtn.innerHTML;
        receiptBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        receiptBtn.disabled = true;
        
        setTimeout(() => {
            receiptBtn.innerHTML = originalText;
            receiptBtn.disabled = false;
        }, 2000);
    }
}

function resetCheckoutForm() {
    if (checkoutForm) {
        checkoutForm.reset();
    }
    
    quantity = 1;
    if (qtyDisplay) qtyDisplay.textContent = '1';
    selectedSize = 'M';
    
    sizeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.size === 'M') {
            btn.classList.add('active');
        }
    });
    
    updateOrderSummary();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isProcessing) {
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
        notes: document.getElementById('notes').value,
        terms: document.getElementById('terms').checked
    };
    
    const errors = validateFormData(formData);
    if (errors.length > 0) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        return;
    }
    
    try {
        const total = basePrice * quantity + shippingCost + (basePrice * quantity * taxRate);
        showLoading(payButton);
        await processPayment(formData);
        
    } catch (error) {
        resetLoadingState();
    }
}

function setupEventListeners() {
    if (qtyMinus) {
        qtyMinus.addEventListener('click', () => updateQuantity(-1));
    }
    if (qtyPlus) {
        qtyPlus.addEventListener('click', () => updateQuantity(1));
    }
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleFormSubmit);
    }
}

document.addEventListener('DOMContentLoaded', init);