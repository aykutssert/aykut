# AI Pet: Chrome Extension Geliştirme Planı

Bu döküman, OpenAI Codex Pets projesinden esinlenen, web tabanlı AI etkileşimlerini (ChatGPT, Claude, Gemini, Google Sheets vb.) canlandıran bir Chrome Extension olan **AI Pet**'in mühendislik ve ürün yol haritasını içerir.

## 1. Temel Vizyon
AI Pet, kullanıcının web üzerindeki yapay zeka ile olan iletişimini görselleştiren, AI'ın "düşünme", "yazma" ve "hata" durumlarını animasyonlarla yansıtan bir dijital yoldaştır.

## 2. Tasarım & Konumlandırma
*   **Konum (The Floor):** Pet, ekranın en alt sınırını (viewport bottom) zemin kabul eder (`position: fixed; bottom: 0`).
*   **Görsel Dil:** Şeffaf arka plan üzerinde yaşayan, sayfa içeriğiyle etkileşime giren animasyonlu karakter.
*   **Kullanıcı Kontrolü:** Sürükle-bırak (Drag & Drop) özelliği ile pet ekranın istenen köşesine taşınabilir.

## 3. Teknik Mimari
Extension, modern Web standartları ve Chrome Extension Manifest v3 üzerine inşa edilecektir.

### A. Shadow DOM İzolasyonu
Sitenin kendi CSS kurallarının pet'in görünümünü bozmasını engellemek için tüm pet arayüzü bir **Shadow DOM** içinde enjekte edilecektir.

### B. State Machine (Durum Makinesi)
Pet'in animasyon geçişlerini yöneten merkezi bir logic yapısı:
*   `IDLE`: Standart bekleme.
*   `WAITING`: Kullanıcı metin alanına tıkladığında.
*   `RUNNING`: Veri gönderilirken veya işlem yapılırken.
*   `REVIEW`: AI cevap verirken (streaming sırasında).
*   `JUMPING`: İşlem başarıyla tamamlandığında.
*   `FAILED`: Hata durumunda.

### C. AI Pattern Recognition (Zeka Katmanı)
Her sitede çalışabilmesi için şu mekanizmalar kullanılır:
*   **Global Event Listeners:** `input`, `textarea` focus ve `Enter` tuşu basımlarını izler.
*   **MutationObserver:** Sayfaya yeni eklenen metin bloklarını (streaming) ve hata mesajlarını gerçek zamanlı tespit eder.
*   **Site-Specific Drivers:** ChatGPT, Claude gibi dev platformlar için özel DOM seçicileri.

## 4. Animasyon Matrisi

| Animasyon | Tetikleyici Aksiyon | Açıklama |
| :--- | :--- | :--- |
| `idle` | Aktivite yok | Pet sakinleşir ve bekler. |
| `waving` | Sayfa yüklendiğinde | Kullanıcıyı selamlar. |
| `waiting` | Input focus | Kullanıcının yazmasını bekler. |
| `running-right/left` | Submit (Enter/Click) | Veriyi "götürüyormuş" gibi koşar. |
| `review` | AI Response (Streaming) | Yazılan cevabı inceler. |
| `jumping` | Success Response | Cevap bittiğinde sevinir. |
| `failed` | Error / Network Down | Üzgün veya şaşkın mod. |

## 5. Geliştirme Yol Haritası (Roadmap)

### Aşama 1: MVP (Minimum Viable Product)
- Manifest v3 kurulumu.
- Shadow DOM injector geliştirilmesi.
- `idle` ve `running` animasyonlarının temel döngüsünün kurulması.

### Aşama 2: Intelligence & Observers
- `MutationObserver` ile AI streaming tespiti.
- ChatGPT ve Claude için özel trigger'ların yazılması.
- Global `input` focus yakalayıcı.

### Aşama 3: UX & Interactivity
- Sürükle-bırak desteği.
- Pet'e tıklandığında rastgele animasyonlar tetikleme.
- Ayarlar paneli (Hangi sitelerde çalışsın?).

### Aşama 4: Gamification & Evolution
- Kullanım sıklığına göre pet'in seviye atlaması.
- Farklı pet türleri (Ejderha, Kedi, Robot) seçeneği.
- "Easter Eggs" (Örn: Gece 00:00'dan sonra pet'in uyuması).

---
**Not:** Bu proje, kullanıcıyı sadece bir araçla değil, bir "karakterle" etkileşime sokarak AI kullanım deneyimini duygusal bir boyuta taşımayı hedefler.
