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


    // --- YENİ: FIREBASE BAĞLANTISI VE YORUM SİSTEMİ ---
    
    // 1. ADIM: SİZİN FIREBASE BİLGİLERİNİZ BURAYA EKLENDİ
    // -----------------------------------------------------
    const firebaseConfig = {
      apiKey: "AIzaSyCVGf2CsBIhqYOWW0Ge0x-aV2RnXSLC4oU",
      authDomain: "senkoy-546b6.firebaseapp.com",
      projectId: "senkoy-546b6",
      storageBucket: "senkoy-546b6.firebasestorage.app",
      messagingSenderId: "170036769096",
      appId: "1:170036769096:web:23bc9bd79fb4b41ea7837d"
    };
    // -----------------------------------------------------

    // Firebase'i başlat
    try {
        // v8 SDK'sını (index.html'de yüklediğimiz) kullanarak başlat
        firebase.initializeApp(firebaseConfig); 
        const db = firebase.firestore(); // Firestore Veritabanı referansı

        // 2. ADIM: YORUMLARI GÖNDERME
        const commentForm = document.getElementById('comment-form');
        const statusMessage = document.getElementById('form-status-message');
        const submitButton = document.getElementById('comment-submit-btn');

        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Formun sayfayı yenilemesini engelle
                
                const name = document.getElementById('comment-name').value;
                const text = document.getElementById('comment-text').value;
                
                // Butonu devre dışı bırak
                submitButton.disabled = true;
                submitButton.textContent = "Gönderiliyor...";

                // Yorumu veritabanına ekle
                db.collection("comments").add({
                    name: name,
                    text: text,
                    status: "pending", // Yorumun "onay bekliyor" olduğunu belirtir
                    createdAt: firebase.firestore.FieldValue.serverTimestamp() // Tarih damgası
                })
                .then(() => {
                    // Başarılı olduğunda
                    statusMessage.textContent = "Yorumunuz onaya gönderildi. Teşekkür ederiz!";
                    statusMessage.className = "success";
                    commentForm.reset(); // Formu temizle
                    submitButton.disabled = false;
                    submitButton.textContent = "Yorumu Gönder";
                })
                .catch((error) => {
                    // Hata olursa
                    console.error("Hata: ", error);
                    statusMessage.textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
                    statusMessage.className = "error";
                    submitButton.disabled = false;
                    submitButton.textContent = "Yorumu Gönder";
                });
            });
        }

        // 3. ADIM: ONAYLANMIŞ YORUMLARI SİTEDE GÖSTERME
        const commentsList = document.getElementById('comments-list');
        if (commentsList) {
            db.collection("comments")
              .where("status", "==", "approved") // Sadece "onaylanmış" olanları al
              .orderBy("createdAt", "desc")      // Yeniden eskiye sırala
              .onSnapshot((querySnapshot) => {
                  commentsList.innerHTML = ""; // Listeyi her seferinde temizle
                  if (querySnapshot.empty) {
                      commentsList.innerHTML = "<p style='text-align: center; font-style: italic;'>Henüz onaylanmış bir yorum bulunmuyor. İlk yorumu siz yapın!</p>";
                  } else {
                      querySnapshot.forEach((doc) => {
                          const comment = doc.data();
                          // Yorum için HTML oluştur
                          const commentEl = document.createElement('div');
                          commentEl.className = 'comment-item';
                          commentEl.innerHTML = `
                              <p>"${comment.text}"</p>
                              <span>- ${comment.name}</span>
                          `;
                          commentsList.appendChild(commentEl);
                      });
                  }
              });
        }

    } catch (e) {
        console.error("Firebase başlatılırken bir hata oluştu. API anahtarlarınızı kontrol edin.", e);
        // Hata durumunda formu gizle ve hata mesajı göster
        const commentForm = document.getElementById('comment-form');
        const commentsList = document.getElementById('comments-list');
        if (commentForm) commentForm.style.display = 'none';
        
        if (commentsList) {
            commentsList.innerHTML = "<p style='text-align: center; color: #d9534f; font-weight: 600;'>Yorum sistemi şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.</p>";
        }
    }
    // --- FIREBASE KODU BİTTİ ---


    // --- SEPET SİSTEMİ KODU ---
    // (Bu kodda değişiklik yok)
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


    // --- SSS (FAQ) AKORDEON KODU ---
    // (Bu kodda değişiklik yok)
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            
            button.classList.toggle('active');

            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                answer.style.padding = "0px 30px"; 
            } else {
                answer.style.padding = "25px 30px"; 
                answer.style.maxHeight = answer.scrollHeight + "px"; 
            }
        });
    });
    // --- SSS KODU BİTTİ ---

});