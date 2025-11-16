// Kod, sayfanın tamamen yüklenmesini bekler
document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------------------------------
    // 1. ADIM: SİZİN FIREBASE BİLGİLERİNİZ
    // (script.js'teki ile aynı olmalı)
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
    // 2. ADIM: GİZLİ ŞİFRENİZİ BELİRLEYİN
    // Buraya sadece sizin bileceğiniz bir şifre yazın.
    // -----------------------------------------------------
    const ADMIN_PASSWORD = "030403006"; 
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // ÖNEMLİ: "SifreniziBurayaYazin123" yazan yeri değiştirin!
    

    // Firebase'i başlat
    try {
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore(); // Firestore Veritabanı referansı
        const commentsRef = db.collection("comments");

        // Gerekli HTML Elementlerini Seç
        const passwordPrompt = document.getElementById('password-prompt');
        const adminPanel = document.getElementById('admin-panel');
        const passwordInput = document.getElementById('password-input');
        const passwordSubmit = document.getElementById('password-submit');
        const passwordError = document.getElementById('password-error');
        const logoutButton = document.getElementById('logout-button');
        const pendingList = document.getElementById('pending-comments-list');
        const approvedList = document.getElementById('approved-comments-list');

        // Şifre Kontrolü
        function checkPassword() {
            if (passwordInput.value === ADMIN_PASSWORD) {
                // Şifre doğru
                sessionStorage.setItem('isAdminAuthenticated', 'true'); // Oturumda tut
                passwordPrompt.style.display = 'none';
                adminPanel.style.display = 'block';
                loadComments(); // Yorumları yükle
            } else {
                // Şifre yanlış
                passwordError.textContent = "Şifre yanlış. Lütfen tekrar deneyin.";
            }
        }

        // Çıkış Yap
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('isAdminAuthenticated');
            location.reload(); // Sayfayı yenile (şifre ekranına döner)
        });

        // Sayfa yüklendiğinde oturum kontrolü
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            passwordPrompt.style.display = 'none';
            adminPanel.style.display = 'block';
            loadComments(); // Yorumları yükle
        }

        // Şifre gönderme butonu
        passwordSubmit.addEventListener('click', checkPassword);
        // Enter tuşu ile şifre gönderme
        passwordInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') checkPassword();
        });


        // Yorumları Yükle Fonksiyonu
        function loadComments() {
            // Onay Bekleyenleri Yükle (pending)
            commentsRef.where("status", "==", "pending").orderBy("createdAt", "desc").onSnapshot(snapshot => {
                pendingList.innerHTML = ""; // Listeyi temizle
                if (snapshot.empty) {
                    pendingList.innerHTML = "<p>Onay bekleyen yorum bulunmuyor.</p>";
                }
                snapshot.forEach(doc => {
                    const comment = doc.data();
                    const el = createCommentElement(doc.id, comment, 'pending');
                    pendingList.appendChild(el);
                });
            });

            // Onaylanmışları Yükle (approved)
            commentsRef.where("status", "==", "approved").orderBy("createdAt", "desc").onSnapshot(snapshot => {
                approvedList.innerHTML = ""; // Listeyi temizle
                if (snapshot.empty) {
                    approvedList.innerHTML = "<p>Henüz onaylanmış bir yorum yok.</p>";
                }
                snapshot.forEach(doc => {
                    const comment = doc.data();
                    const el = createCommentElement(doc.id, comment, 'approved');
                    approvedList.appendChild(el);
                });
            });
        }

        // Yorum elementi oluşturan yardımcı fonksiyon
        function createCommentElement(id, comment, type) {
            const el = document.createElement('div');
            el.className = 'admin-comment-item';
            
            let buttons = '';
            if (type === 'pending') {
                buttons = `
                    <button class="admin-btn approve" data-id="${id}">Onayla</button>
                    <button class="admin-btn delete" data-id="${id}">Sil</button>
                `;
            } else {
                buttons = `
                    <button class="admin-btn delete" data-id="${id}">Sil (Yayından Kaldır)</button>
                `;
            }
            
            el.innerHTML = `
                <p><strong>${comment.name}</strong> yazdı:</p>
                <p><em>"${comment.text}"</em></p>
                <span>Durum: ${comment.status} | ID: ${id}</span>
                <div class="admin-actions">
                    ${buttons}
                </div>
            `;
            return el;
        }

        // Butonlara tıklama (Onaylama / Silme)
        document.body.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if (!id) return; // ID yoksa devam etme

            if (e.target.classList.contains('approve')) {
                // "Onayla" butonuna basıldı
                if (confirm(`"'${id}'" ID'li yorumu onaylamak istediğinizden emin misiniz?`)) {
                    commentsRef.doc(id).update({ status: "approved" })
                        .catch(e => console.error("Hata - Onaylanamadı: ", e));
                }
            }

            if (e.target.classList.contains('delete')) {
                // "Sil" butonuna basıldı
                if (confirm(`"'${id}'" ID'li yorumu KALICI OLARAK SİLMEK istediğinizden emin misiniz?`)) {
                    commentsRef.doc(id).delete()
                        .catch(e => console.error("Hata - Silinemedi: ", e));
                }
            }
        });

    } catch (e) {
        console.error("Firebase başlatılırken bir hata oluştu.", e);
        alert("Hata: Firebase yüklenemedi. admin.js dosyasındaki 'firebaseConfig' bilgilerini kontrol edin.");
    }
});