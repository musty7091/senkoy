// Kod, sayfanın tamamen yüklenmesini bekler
document.addEventListener('DOMContentLoaded', () => {

    // --- GİRİŞ EKRANI (SPLASH SCREEN) KODU ---
    // (index.html'den buraya taşındı)
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
    
    // Hafızadan (localStorage) eski sepeti yükle, yoksa boş bir sepet oluştur
    let cart = JSON.parse(localStorage.getItem('senkoyCart')) || {};

    // Sepet ikonundaki sayıyı güncelleyen fonksiyon
    function updateCartCount() {
        const totalItems = Object.keys(cart).length; 
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartButton.style.display = 'flex'; // Sepet doluysa ikonu göster
        } else {
            cartButton.style.display = 'none'; // Sepet boşsa gizle
        }
    }

    // "Listeye Ekle" butonlarına tıklandığında çalışacak fonksiyon
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.product-card');
            const productName = card.dataset.name;
            // FİYAT SATIRI KALDIRILDI
            const quantityInput = card.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value, 10);

            if (quantity > 0) {
                // Sepete ürünü ekle (Sadece adet bilgisi)
                cart[productName] = {
                    quantity: quantity
                    // FİYAT BİLGİSİ KALDIRILDI
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

    // Ana "Sipariş Listemi Gönder" (WhatsApp) butonuna tıklandığında
    whatsappOrderButton.addEventListener('click', (event) => {
        cart = JSON.parse(localStorage.getItem('senkoyCart')) || {};
        const productNames = Object.keys(cart);

        if (productNames.length === 0) {
            return; // Sepet boşsa, normal "Merhaba" mesajıyla devam et
        }

        // Sepet doluysa, butonun normal linkine gitmesini ENGELLE
        event.preventDefault();

        let message = "Merhaba, Şenköy Doğal ürünlerinizden sipariş vermek istiyorum:\n\n*SİPARİŞ LİSTEM:*\n";
        // TOPLAM FİYAT DEĞİŞKENİ KALDIRILDI

        // Mesajı oluştur
        productNames.forEach(name => {
            const item = cart[name];
            // FİYAT HESAPLAMALARI KALDIRILDI
            message += `- ${item.quantity} x ${name}\n`;
        });

        // TOPLAM TUTAR MESAJI KALDIRILDI, YENİ MESAJ EKLENDİ
        message += `\n(Listem bu şekildedir. Fiyat ve teslimat bilgisi bekliyorum.)`;

        const whatsappNumber = "905449632683";
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank');
        
        // Siparişi gönderdikten sonra sepeti ve hafızayı temizle
        cart = {};
        localStorage.removeItem('senkoyCart');
        updateCartCount();
    });

    // Yüzen sepet ikonuna tıklandığında "Sipariş Ver" bölümüne yumuşakça kaydır
    cartButton.addEventListener('click', () => {
        document.getElementById('siparis').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Sayfa ilk yüklendiğinde sepet ikonunu güncelle
    updateCartCount();
});