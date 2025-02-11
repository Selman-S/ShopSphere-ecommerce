

### **📌 E-Ticaret Backend Diyagramı (Mermaid Formatı)**

```mermaid
graph TD;
    
    subgraph Kullanıcı Yönetimi
        User[👤 Kullanıcı]
        User -->|Kayıt / Giriş| Auth[🔐 JWT Authentication]
        User -->|Ürünleri Görüntüleme| Products
        User -->|Sepete Ürün Ekleme| Cart
    end
    
    subgraph Ürün Yönetimi
        Products[🛒 Ürün Yönetimi]
        Products -->|CRUD İşlemleri| DB[(🗄️ MongoDB)]
        Products -->|Kategori & Filtreleme| Categories[📂 Kategoriler]
        Products -->|Görselleri Yükleme| Storage[📁 Cloudinary]
        Products -->|Önbellekleme| Cache[⚡ Redis Cache]
    end
    
    subgraph Sepet & Sipariş Yönetimi
        Cart[🛍 Sepet Yönetimi]
        Cart -->|Sipariş Oluşturma| Orders[📦 Sipariş Yönetimi]
        Orders -->|Kargo Takibi| Shipping[🚚 Kargo Entegrasyonu]
        Orders -->|Sipariş Bildirimi| Notifications[📩 Bildirim Servisi]
    end
    
    subgraph Ödeme Entegrasyonu
        Payments[💳 Ödeme Sistemleri]
        Payments -->|Stripe / Iyzico / PayPal| Transactions[(📝 Ödeme İşlemleri)]
        Payments -->|Ödeme Bildirimi| Notifications
    end
    
    subgraph Admin Paneli
        Admin[🛠 Admin Paneli]
        Admin -->|Ürün Yönetimi| Products
        Admin -->|Sipariş Yönetimi| Orders
        Admin -->|Kampanya / Raporlama| Reports[📊 Raporlama & Analiz]
    end

    subgraph Ekstra Servisler
        Cache
        Storage
        Notifications
    end

    Orders -->|Ödeme Doğrulama| Payments
```

---

### **💡 Açıklamalar**
- **Kullanıcılar** → Ürünleri görebilir, sepete ekleyebilir, sipariş oluşturabilir.
- **Ürün Yönetimi** → Ürünler eklenir/güncellenir, kategorilere ayrılır, önbellekleme kullanılır.
- **Sepet & Sipariş Yönetimi** → Kullanıcılar sipariş oluşturur, sipariş kargo süreci takip edilir.
- **Ödeme Entegrasyonu** → Stripe, Iyzico veya PayPal üzerinden ödeme alınır.
- **Admin Paneli** → Siparişleri ve ürünleri yönetir, kampanyalar düzenler, raporlar oluşturur.
- **Ekstra Servisler** → Redis önbellekleme, Cloudinary/AWS S3 dosya yükleme, bildirim sistemi.

---

Bu diyagramı **Mermaid destekleyen bir Markdown editöründe** (GitHub, Obsidian, Typora, VS Code Mermaid Plugin) doğrudan çalıştırabilirsiniz. 🚀