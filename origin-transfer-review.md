# Origin Transfer Review

Vercel grafikleri: sorun genel user transfer degil, origin/blob store tarafinda iki gunluk ani artis. Review hedefi hangi path veya asset davranisinin origin'i sisirdigini bulmak.

- [x] Vercel usage ekranindaki sinyali not et
  - Blob Stores: 8.38 GB.
  - Direction: incoming 1.95 GB, outgoing 6.43 GB.
  - Region: Washington iad1 8.36 GB, digerleri ihmal edilebilir.
  - Yorum: artis iki gunde ani. Lokal test degil, prod uzerinden gelen traffic/crawl veya cache invalidation.
- [!] Sitemap ve robots.txt bot/crawler icin riskli mi kontrol et
  - robots sadece `/admin/` kapatiyor.
  - `/api/`, `/auth/`, `/login`, `/account/`, `/reset-password` botlara kapali degil.
  - sitemap docs ve tag query URL'leri uretiyor; bu normal ama crawl alanini buyutuyor.
  - Done: robots disallow listesi genisletildi.
- [!] Public sayfalar cache/ppr acisindan gereksiz dynamic mi kontrol et
  - `/prompts` auth cookie okuyor; loginli like state icin dynamic stream var.
  - prompt detay sayfasi prompt ise auth cookie okuyor; loginli like state icin dynamic stream var.
  - public data fonksiyonlari `use cache` kullaniyor, bu taraf iyi.
- [!] API endpointleri bot veya client tarafindan gereksiz cagiriliyor mu kontrol et
  - `/api/pets/view` her pet detay ziyaretinde DB update + `revalidateTag('pets')` yapiyor.
  - Bot pet detaylarini gezerse pets cache surekli invalidate olur, origin transfer artabilir.
  - `proxy.ts` matcher `/api/:path*`; public API'lerde bile once Supabase `getUser()` calisiyor.
  - Done: pet view endpoint no-op yapildi; detay sayfasi artik view POST atmiyor.
  - Done: public API fast-path eklendi, proxy public API'lerde auth calistirmiyor.
- [x] Gorsel/asset kaynaklari Vercel Blob veya public asset olarak origin transfer sisiriyor mu kontrol et
  - Projede `@vercel/blob` kullanimi yok.
  - `public/` toplam yaklasik 232 KB, sorun degil.
  - Gorseller Supabase Storage public URL uzerinden geliyor.
- [!] Pet animasyon ve sprite yukleme/indirme davranisi trafik acisindan riskli mi kontrol et
  - Pet kartlari spritesheet'i canvas icin yukluyor; asset Supabase'den geliyor ama cok kartta client maliyeti var.
  - Download endpoint `/api/pets/download` spritesheet'i server tarafinda fetch ediyor; sik kullanilirsa origin compute tuketir.
  - `RoamingPetWrapper` root layout'ta her sayfada Supabase'den aktif pet ayarini okuyor; cache eklenebilir.
  - Done: roaming pet aktif ayari cache'li helper'a tasindi.
- [!] Search/auth/like/view client fetch davranislari gereksiz request uretiyor mu kontrol et
  - Navbar `AuthButton` her browser page load'da `/api/auth/me` cagiriyor.
  - Pet listesinde her like button mount'ta `/api/pets/like?id=...` cagiriyor; liste kart sayisi kadar request demek.
  - Search modal bos acilista fetch atmiyor; bu taraf iyi.
  - Done: pet liste sayfasi like status artik tek `/api/pets/likes` batch istegiyle aliyor.
- [!] Sonuc ve uygulanacak fix listesini netlestir
  - Karar 1: Pet goruntuleme sayaci MVP icin kaldirilacak veya pasif hale getirilecek. Detay sayfasi view POST atmayacak. En azindan `revalidateTag('pets')` kesin kalkacak.
  - Karar 2: Like kalacak. Liste sayfasinda kart basina GET yapisi kaldirilacak; liked status batch olarak alinacak ya da anonim kullanicida ilk acilista status sorgusu yapilmayacak.
  - Karar 3: `robots.txt` `/api/`, `/auth/`, `/login`, `/account/`, `/reset-password` icin genisletilecek.
  - Karar 4: `proxy.ts` public API'lerde gereksiz Supabase auth calistirmayacak sekilde ayrilacak.
  - Karar 5: `RoamingPetWrapper` aktif pet ayarini server cache ile okuyacak; her page request'te Supabase'e gitmeyecek.
  - Karar 6: Pet kartlarinda mevcut davranis korunacak: default static, hover/focus olunca client tarafinda animasyon. Ekstra play butonu simdilik gerekli degil.

## Implementation Plan

- [x] Pet view tracking'i detay sayfasindan kaldir veya no-op yap
- [x] `/api/pets/view` cache invalidation davranisini kaldir
- [x] Pet like status'u kart basina GET olmaktan cikar
- [x] Gerekirse pet liked status icin batch endpoint veya server-side batch veri ekle
- [x] Roaming pet aktif ayarini cache'li data fonksiyonuna tasi
- [x] Pet kartlarinin static default + hover/focus animasyon davranisini dogrula
  - Mevcut `PetListCard` active state'i hover/focus ile aciyor.
  - `PetCardCanvas` sadece active/focused durumunda RAF animasyonu baslatiyor.
- [x] Robots disallow listesini genislet
- [x] Proxy public API fast-path ekle
- [x] Build/lint kontrol et
  - Scoped lint temiz.
  - `npm run build` temiz.
