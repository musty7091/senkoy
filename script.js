// Bu kod, tüm sayfanın yüklenmesini bekler
document.addEventListener('DOMContentLoaded', () => {

    // Gerekli HTML elementlerini seçiyoruz
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const whatsappOrderButton = document.getElementById('whatsapp-order-button');
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    
    // Hafızadan (localStorage) eski sepeti yükle, yoksa boş bir sepet oluştur
    let cart = JSON.parse(localStorage.getItem('senkoyCart')) || {};

    // Sepet ikonundaki sayıyı güncelleyen fonksiyon
    function updateCartCount() {
        // Sepette kaç *çeşit* ürün olduğunu sayar
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
            const productPrice = parseInt(card.dataset.price, 10);
            const quantityInput = card.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value, 10);

            if (quantity > 0) {
                // Sepete ürünü ekle veya adedini güncelle
                cart[productName] = {
                    quantity: quantity,
                    price: productPrice
                };
                
                // Butonun metnini ve stilini geçici olarak değiştir
                button.textContent = 'Eklendi!';
                button.classList.add('added');
                
                // 1.5 saniye sonra eski haline döndür
                setTimeout(() => {
                    button.textContent = 'Listeye Ekle';
                    button.classList.remove('added');
                }, 1500);

            } else {
                // Eğer adet 0 veya negatifse sepetten çıkar
                delete cart[productName];
            }

            // Sepeti hafızaya (localStorage) kaydet
            localStorage.setItem('senkoyCart', JSON.stringify(cart));
            // İkondaki sayıyı güncelle
            updateCartCount();
        });
    });

    // Ana "Sipariş Listemi Gönder" (WhatsApp) butonuna tıklandığında
    whatsappOrderButton.addEventListener('click', (event) => {
        // Sepeti hafızdan tekrar oku
        cart = JSON.parse(localStorage.getItem('senkoyCart')) || {};
        const productNames = Object.keys(cart);

        // Sepet boşsa, normal "Merhaba" mesajıyla devam et
        if (productNames.length === 0) {
            // Hiçbir şey yapma, butonun normal linkine gitmesine izin ver
            return;
        }

        // Sepet doluysa, butonun normal linkine gitmesini ENGELLE
        event.preventDefault();

        let message = "Merhaba, Şenköy Doğal ürünlerinizden sipariş vermek istiyorum:\n\n*SİPARİŞ LİSTEM:*\n";
        let totalPrice = 0;

        // Mesajı ve toplam fiyatı oluştur
        productNames.forEach(name => {
            const item = cart[name];
            const itemTotal = item.quantity * item.price;
            message += `- ${item.quantity} x ${name} (${itemTotal} TL)\n`;
            totalPrice += itemTotal;
        });

        message += `\n*Toplam Tutar:* ${totalPrice} TL\n\n(Adres ve ödeme bilgileri için sizinle iletişime geçeceğim.)`;

        // WhatsApp linkini oluştur (Telefon numarasını ve mesajı birleştir)
        const whatsappNumber = "905449632683";
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Müşteriyi bu yeni linke yönlendir
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