const images = [
    'assets/IMG_1732 (1).JPG',
    'assets/IMG_1660.JPG',
    'assets/IMG_1720.JPG',
    'https://www.mdesiigns.com/cdn/shop/files/2_bd317869-f68f-4d67-819b-06d475fcc36b.png'
];

let currentSlide = 0;
let selectedSize = 'M';
let autoSlideInterval;

function init() {
    createThumbnails();
    setupEventListeners();
    updateWhatsAppLink();
    startAutoSlide();
}

function createThumbnails() {
    const container = document.getElementById('thumbnailsContainer');
    const totalSlides = document.getElementById('totalSlides');
    
    container.innerHTML = '';
    totalSlides.textContent = images.length;
    
    images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
        thumbnail.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Hoodie View ${index + 1}`;
        
        thumbnail.appendChild(img);
        container.appendChild(thumbnail);
        
        thumbnail.addEventListener('click', () => {
            changeSlide(index);
            resetAutoSlide();
        });
    });
}

function changeSlide(index) {
    currentSlide = index;
    const currentImage = document.getElementById('currentImage');
    const currentSlideSpan = document.getElementById('currentSlide');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    currentImage.style.opacity = '0';
    
    setTimeout(() => {
        currentImage.src = images[index];
        currentSlideSpan.textContent = index + 1;
        currentImage.style.opacity = '1';
        
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }, 200);
}

function setupEventListeners() {
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const sizeGuideLink = document.querySelector('.size-guide-link a');
    const closeModal = document.querySelector('.close-modal');
    const sizeGuideModal = document.getElementById('sizeGuide');
    const whatsappButton = document.getElementById('whatsappOrderButton');
    
    prevBtn.addEventListener('click', () => {
        currentSlide = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
        changeSlide(currentSlide);
        resetAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        currentSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
        changeSlide(currentSlide);
        resetAutoSlide();
    });
    
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
            document.getElementById('selectedSizeDisplay').textContent = selectedSize;
            updateWhatsAppLink();
        });
    });
    
    sizeGuideLink.addEventListener('click', (e) => {
        e.preventDefault();
        sizeGuideModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', () => {
        closeSizeGuide();
    });
    
    sizeGuideModal.addEventListener('click', (e) => {
        if (e.target === sizeGuideModal) {
            closeSizeGuide();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sizeGuideModal.style.display === 'flex') {
            closeSizeGuide();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentSlide = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
            changeSlide(currentSlide);
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            currentSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
            changeSlide(currentSlide);
            resetAutoSlide();
        }
    });
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    const mainImageContainer = document.querySelector('.main-image-container');
    
    mainImageContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    mainImageContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            currentSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
            changeSlide(currentSlide);
            resetAutoSlide();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            currentSlide = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
            changeSlide(currentSlide);
            resetAutoSlide();
        }
    }
    
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('mouseenter', () => {
            thumbnail.style.transform = 'scale(1.05)';
        });
        
        thumbnail.addEventListener('mouseleave', () => {
            thumbnail.style.transform = 'scale(1)';
        });
    });
    
    whatsappButton.addEventListener('mouseenter', () => {
        whatsappButton.style.transform = 'scale(1.02)';
    });
    
    whatsappButton.addEventListener('mouseleave', () => {
        whatsappButton.style.transform = 'scale(1)';
    });
}

function closeSizeGuide() {
    const sizeGuideModal = document.getElementById('sizeGuide');
    sizeGuideModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateWhatsAppLink() {
    const productName = 'JNC Premium Hoodie';
    const price = 'IDR 450,000';
    const phoneNumber = '+6285121599993';
    
    const message = `Halo JNC Merch! Saya ingin memesan:\n\n` +
                   `Produk: ${productName}\n` +
                   `Size: ${selectedSize}\n` +
                   `Harga: ${price}\n\n` +
                   `Apakah masih tersedia?`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    const whatsappButton = document.getElementById('whatsappOrderButton');
    whatsappButton.href = whatsappUrl;
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentSlide = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
        changeSlide(currentSlide);
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
        this.src = 'https://www.mdesiigns.com/cdn/shop/files/2_bd317869-f68f-4d67-819b-06d475fcc36b.png';
        this.alt = 'Image not available';
    });
});

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('scroll', () => {
    const backHome = document.querySelector('.back-home');
    if (window.scrollY > 300) {
        backHome.style.opacity = '0.7';
        backHome.style.transform = 'translateY(0)';
    } else {
        backHome.style.opacity = '1';
        backHome.style.transform = 'translateY(-10px)';
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;

document.head.appendChild(style);


