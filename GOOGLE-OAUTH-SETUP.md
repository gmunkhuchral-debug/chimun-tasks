# 🔐 Google Sign-In тохируулах заавар (Чимун ХХК CEO-д зориулсан)

**Зорилго:** Ажилтан өөрийн Google имэйлээр аппад нэвтрэх боломжтой болгох. Энэ нь нууц үг хадгалах, мартаж reset хийх асуудлыг бүрэн арилгана. CEO зөвхөн **нэг л удаа** энэ тохируулга хийнэ — дараа автоматаар бүх ажилтан ашиглана.

**Хугацаа:** ~10-15 минут

**Үнэ:** 0₮ (Google-д үнэгүй)

---

## ① Google Cloud Console нээх

1. https://console.cloud.google.com/ нээх
2. Гүйцэтгэх захирлын `gmunkhuchral@gmail.com` дансаар нэвтрэх (өөр аль ч gmail байж болно, гэхдээ дараа админ үүрэгтэй байх энэ данс байх ёстой)
3. Анх удаа нэвтэрвэл "Terms of Service"-г хүлээн зөвшөөрнө

## ② Шинэ project үүсгэх

1. Дээр зүүн буланд **"Select a project"** дроп даран **"New Project"** товч дарна
2. Project name: **`Chimun Tasks`** (эсвэл өөр сонголт)
3. Organization: үлдээх (хувийн бол "No organization")
4. **Create** дарна
5. 30 секунд хүлээгээд дээр баруунд "Project created" гэж гарна — баруун дээр project switcher-аас **`Chimun Tasks`**-г сонгоно

## ③ OAuth Consent Screen тохируулах

OAuth client үүсгэхийн өмнө consent screen үүсгэх ёстой. Энэ нь хэрэглэгчид нэвтрэх үед "Аль апп руу нэвтрэх вэ?" гэдэг диалог дээр харагдана.

1. Зүүн талын menu (☰) → **APIs & Services** → **OAuth consent screen**
2. **User Type:** `External` сонгож **Create** дарна
3. App information дотор:
   - **App name:** `Чимун Tasks`
   - **User support email:** `gmunkhuchral@gmail.com` сонгох
   - **App logo:** алгасах (хүсвэл `icon.svg`-г 128x128 PNG болгон оруулж болно)
4. App domain (бүгдийг алгасах боломжтой)
5. **Authorized domains:** `+ Add Domain` дараад `github.io` нэмнэ
6. **Developer contact information:** `gmunkhuchral@gmail.com`
7. **Save and Continue**

8. Дараагийн дэлгэц "**Scopes**" — энэ хэрэгцээгүй, **Save and Continue** даран алгасна

9. "**Test users**" — `+ Add Users` дараад **бүх ажилтны Gmail хаягийг нэмнэ**:
   - gmunkhuchral@gmail.com (CEO)
   - i.altansukh0820@gmail.com
   - akunaa.anujin@gmail.com
   - delgerbat69@gmail.com
   - temuulen@nomaadglobal.com
   - tuvdendar@gmail.com
   - sodkhuu26@gmail.com
   - b.enerel1025@gmail.com
   - saigotuguldur@gmail.com
   - (бусдын Gmail-ыг нэмнэ — Сайнжаргал, Шижирсаран, Нинждолгор гэх мэт)
   
   > **Анхаар:** Зөвхөн энд нэмсэн ажилтан гэдэг л нэвтэрч чадна. Дараа шинэ ажилтан орвол энэ жагсаалтад нэмнэ.

10. **Save and Continue**

11. Хураангуй харуулна — **Back to Dashboard**

> **Production-д гаргах:** Test mode-д 100 хэрэглэгчийн хязгаартай. Үүнээс хэтрэх бол OAuth consent screen-ийг "Production"-д шилжүүлнэ — Google-н shifg баталгаажуулалт шаардлагатай (~1 долоо хоног). Одоохондоо "Test mode" хангалттай.

## ④ OAuth 2.0 Client ID үүсгэх

1. Зүүн menu → **APIs & Services** → **Credentials**
2. Дээр **+ Create Credentials** → **OAuth client ID** сонгоно
3. **Application type:** `Web application`
4. **Name:** `Chimun Tasks Web Client`
5. **Authorized JavaScript origins** хэсэгт `+ Add URI` дараад дараах **3 URL-г** оруулна:

   ```
   https://gmunkhuchral-debug.github.io
   http://localhost
   http://localhost:8000
   ```

   > **Чухал:** URL-н төгсгөлд **/** тэмдэгт байх ёсгүй. Зүгээр `https://gmunkhuchral-debug.github.io` гэж бичнэ. localhost нь дотооддоо шалгах үед хэрэгтэй.

6. **Authorized redirect URIs** — хэрэгцээгүй, алгасна
7. **Create** дарна
8. Pop-up цонх гарна — **Client ID** гэдэг урт мөр (жишээ нь `123456789-abc...apps.googleusercontent.com`).

## ⑤ Client ID-г надтай хуваалцах

Урт мөр (Client ID) нь нууц биш — зүгээр URL-г таних бичлэг. Үүнийг chat-д надад илгээгээрэй. Жишээ:

```
123456789012-abc1def2ghi3jkl4mno5pqr6stu7vwx.apps.googleusercontent.com
```

Би `index.html` файлд оруулаад GitHub-руу push хийнэ. 5-10 минутын дараа live аппад Google Sign-In идэвхжсэн байна.

> **Анхаар:** Client Secret гэдэг өөр бас нэг утга байх ёстой ч **БҮҮ** надтай хуваалц. Энэ бол жинхэнэ нууц үг. Зүгээр Google Cloud-д үлдээ. Бид Web client дээр secret хэрэглэхгүй учир үлдсэн нь зүгээр л.

---

## Дараагийн алхмууд (миний ажил)

Чи Client ID-г хуваалцсаны дараа би:

1. ✅ `index.html`-н дээд хэсэгт `GOOGLE_CLIENT_ID` тогтмолд хуулна
2. ✅ TEAM-н хүн бүрд email талбар нэмэх (одоогоор Drive-аас олдсон 9-ийг хийсэн, бусдад placeholder)
3. ✅ Login screen UI бичих
4. ✅ Google Identity Services-ийн script нэмэх
5. ✅ JWT decode → email match → state.user суулгах логик
6. ✅ Non-CEO бол зөвхөн өөрийн task харуулах filter
7. ✅ Logout товч
8. ✅ GitHub-руу push, live URL дээр шалгах

---

## Бэрхшээл гарвал

| Асуудал | Шийдэл |
|---|---|
| "Access blocked: This app is blocked" | OAuth consent screen → Test users-д тэр имэйлийг нэмнэ |
| "redirect_uri_mismatch" | Authorized JavaScript origins-д URL зөв оруулагдсан эсэхийг шалга. `https://`-той эсэхийг шалга |
| "invalid_client" | Client ID-г зөв хуулсан эсэхийг шалга. Бүрэн ".apps.googleusercontent.com"-аар төгсөж байх ёстой |
| Test mode хязгаар хэт хатуу | OAuth consent screen → Publishing status → "Publish App" дарж production-д явуулна. Гэхдээ Google review шаардлагатай |

Бэлэн болсны дараа Client ID-г хуваалц.
