# GitHub-руу шилжүүлэх — алхам алхмын заавар

**Хугацаа:** ~10 минут
**Эзэн:** CEO Г.Мөнх-Учрал (gmunkhuchral-debug)
**Repo:** `chimun-tasks` (public)

---

## ❶ GitHub дээр шинэ repo үүсгэх (2 минут)

1. Browser-аас https://github.com/new нээх
2. **Repository name:** `chimun-tasks`
3. **Description:** `Чимун ХХК - дотоод даалгаврын апп (M Event + Camp)`
4. **Public** сонгох ✓
5. **Initialize this repository with:**
   - README — **хий ҮГҮЙ** (бид өөрсдийн README-тэй)
   - .gitignore — **хий ҮГҮЙ** (бид өөрийн .gitignore-той)
   - License — **хий ҮГҮЙ** (одоохондоо хэрэгчгүй)
6. **Create repository** дарах

GitHub дараагийн хуудсыг харуулна — энэ хуудсыг хаахгүй байгаарай, дараагийн алхамд URL хэрэгтэй.

---

## ❷ Mac-н Terminal нээх

Spotlight (⌘+Space) → "Terminal" гэж бичээд Enter.

---

## ❸ Repo-руу шилжих (1 line)

Terminal дотор бичих:

```bash
cd "/Users/munkhuchralganbat/Desktop/web site & app/АПП ЧИМУН ХХК"
```

Дараа нь Enter.

---

## ❹ Git index.lock-ыг устгах (бид сандбокс дотроос үлдээсэн)

```bash
rm -f .git/index.lock
```

---

## ❺ Бүх файлыг commit хийх (1 line)

```bash
git add . && git commit -m "Initial commit: Чимун Tasks app v1"
```

Үр дүн: ~30 файл commit хийгдсэн гэж харагдана.

---

## ❻ GitHub-руу холбож push хийх

Алхам ❶ дээр GitHub нь танд харуулсан URL-ыг (`https://github.com/gmunkhuchral-debug/chimun-tasks.git`) ашиглана:

```bash
git remote add origin https://github.com/gmunkhuchral-debug/chimun-tasks.git
git push -u origin main
```

**Анхааруулга:** push хийхэд GitHub нь чамаас нэвтрэх хүсэлт гаргаж магадгүй:
- **Username:** gmunkhuchral-debug
- **Password:** GitHub Personal Access Token (Туеваар нууц үг биш!) — хэрэв байхгүй бол [github.com/settings/tokens/new](https://github.com/settings/tokens/new) → `repo` scope сонгоод token үүсгэх → түүнийг нууц үг гэж тавих

Хэрэв та өмнө `nomaadcamp-site`-аа push хийж байсан бол credentials кэшэд хадгалагдсан учир дахиад асуухгүй магадгүй.

---

## ❼ GitHub Pages идэвхжүүлэх (1 минут)

1. https://github.com/gmunkhuchral-debug/chimun-tasks нээх
2. Дээд цэснээс **Settings** → зүүн талаас **Pages**
3. **Source:** `Deploy from a branch` сонгох
4. **Branch:** `main` сонгох
5. **Folder:** `/ (root)` сонгох
6. **Save** дарах

~1 минутын дотор апп нь дараах URL-ээр ажиллана:

```
https://gmunkhuchral-debug.github.io/chimun-tasks/
```

---

## ❽ Шалгалт + ажилтнуудад мэдэгдэх

1. Дээрх URL-ыг утсаар нээх
2. PIN-ээр нэвтрэн орох (CEO PIN: 1234)
3. **Add to Home Screen** хийх (iOS Safari: Share → Add to Home Screen; Android Chrome: 3-цэг → Install)
4. Дараагийн PIN жагсаалтыг ажилтнуудад өгөх:

| Хүн | URL | PIN |
|---|---|---|
| Г.Мөнх-Учрал | https://gmunkhuchral-debug.github.io/chimun-tasks/ | 1234 |
| Алтансүх | дээрх URL | 2001 |
| Сайнжаргал | дээрх URL | 2002 |
| Нинждолгор | дээрх URL | 2004 |
| Пүрэвдавга | дээрх URL | 2005 |
| Баясгалан | дээрх URL | 2006 |
| Эрдэнэхүү | дээрх URL | 2007 |
| Хишигтогтох | дээрх URL | 2008 |
| Дэлгэрбат | дээрх URL | 3001 |
| Батжаргал | дээрх URL | 3002 |
| Цэлмэг | дээрх URL | 3006 |
| Анужин | дээрх URL | 1001 |
| Түвдэндаржаа | дээрх URL | 1003 |

⚠ **Эдгээр PIN нь placeholder.** Бодит хэрэглээний өмнө Master Sheet-д хүн тус бүрээр PIN-ийг өөрчилөөд `n8n /staff` workflow дахин гүйцэтгэх (Sheet-аас pull).

---

## ❾ Цаашид код засах workflow

Шинэ feature нэмэх, bug засах гэх мэт өөрчлөлт хийсэн үед:

```bash
cd "/Users/munkhuchralganbat/Desktop/web site & app/АПП ЧИМУН ХХК"
git add .
git commit -m "Тэдгээрийн товч тайлбар"
git push
```

~30 секундын дараа бүх ажилтан шинэ хувилбарыг харна (service worker автомат update хийнэ).

---

## ⚠ Хэрэв алхам алдсан бол

**"index.lock: Operation not permitted":** sandbox үлдээсэн файл. `sudo rm -f .git/index.lock` бичих.

**"fatal: not a git repository":** ❸ алхам алгасчихсан байж магадгүй. Дахин ❸ → ❹ → ❺-г гүйцэтгэх.

**"Authentication failed":** Personal Access Token шинээр үүсгэх ([энд](https://github.com/settings/tokens/new)). `repo` scope сонгоно.

**"Pages 404 not found":** ❼-ийг хийсэн уу? Pages идэвхжсэний дараа эхний deploy 5-10 минут хүлээх шаардлагатай байж магадгүй.

Гацвал хэлээрэй — би шууд тусална.
