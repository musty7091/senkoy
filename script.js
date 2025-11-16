// Kod, sayfanın tamamen yüklenmesini bekler
document.addEventListener('DOMContentLoaded', () => {

    // --- GİRİŞ EKRANI (SPLASH SCREEN) KODU ---
    const mainContent = document.getElementById('main-content');
    const enterButton = document.getElementById('enter-button');
    const splashScreen = document.getElementById('splash-screen');

    if (mainContent && enterButton && splashScreen) {
        mainContent.style.display = 'none';
        
        enterButton.addEventListener('click', function() {
            splashScreen.style.transition = 'opacity 0.5s ease-out';
            splashScreen.style.opacity = '0';
            mainContent.style.display = 'block';
            
            setTimeout(function() {
                splashScreen.style.display = 'none';
            }, 500); // 0.5 saniye
        });
    }
    // --- GİRİŞ EKRANI KODU BİTTİ ---


    // --- SEPET SİSTEMİ KODU ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const whatsappOrderButton = document.getElementById('whatsapp-order-button');
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    
    let cart = JSON.parse(localStorage.getItem('senkoyCart')) || {};

    function updateCartCount() {
        const totalItems = Object.keys(cart).length; 
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartButton.style.display = 'flex';
        } else {
            cartButton.style.display = 'none';
        }
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.product-card');
            const productName = card.dataset.name;
            const quantityInput = card.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value, 10);

            if (quantity > 0) {
                cart[productName] = {
                    quantity: quantity
                };
                
                button.textContent = 'Eklendi!';
                button.classList.add('added');
                
                setTimeout(() => {
                    button.textContent = 'Listeye Ekle';
                    button.classList.remove('added');
                }, 1500);

            } else {
                delete cart[productName];
            }

            localStorage.setItem('senkoyCart', JSON.stringify(cart));
            updateCartCount();
        });
    });

    whatsappOrderButton.addEventListener('click', (event) => {
        cart = JSON.parse(localStorage.getItem('senkoyCart')) || {};
        const productNames = Object.keys(cart);

        if (productNames.length === 0) {
            return;
        }

        event.preventDefault();

        let message = "Merhaba, Şenköy Doğal ürünlerinizden sipariş vermek istiyorum:\n\n*SİPARİŞ LİSTEM:*\n";
        
        productNames.forEach(name => {
            const item = cart[name];
            message += `- ${item.quantity} x ${name}\n`;
        });

        message += `\n(Listem bu şekildedir. Fiyat ve teslimat bilgisi bekliyorum.)`;

        const whatsappNumber = "905449632683";
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank');
        
        cart = {};
        localStorage.removeItem('senkoyCart');
        updateCartCount();
    });

    cartButton.addEventListener('click', () => {
        document.getElementById('siparis').scrollIntoView({
            behavior: 'smooth'
        });
    });

    updateCartCount();
    // --- SEPET SİSTEMİ KODU BİTTİ ---


    // ***** YENİ KOD: SSS (FAQ) AKORDEON *****
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling; // Butondan sonraki cevap elementi
            
            // Butona 'active' class'ı ekle/kaldır (CSS'te +/- ikonunu değiştirir)
            button.classList.toggle('active');

            // Cevabı aç/kapat
            if (answer.style.maxHeight) {
                // Cevap açıksa, kapat
                answer.style.maxHeight = null;
                answer.style.padding = "0px 30px"; // Kapanırken padding'i sıfırla
            } else {
                // Cevap kapalıysa, aç
                answer.style.padding = "25px 30px"; // Önce padding ver
                answer.style.maxHeight = answer.scrollHeight + "px"; // Sonra yüksekliğini ayarla
            }
        });
    });
    // ***** SSS KODU BİTTİ *****

});