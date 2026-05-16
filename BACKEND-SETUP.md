# 🔄 Backend setup — багийн task sync хийх

**Зорилго:** Бүх ажилтан зэрэг task харж, хооронд нь мэдээлэл солилцох.

**Ажиллах зарчим:** App нь Google Sheet дээр n8n webhook-аар бичиж/уншина. Sheet нь нэг газар бүх task-уудыг хадгалж, хүн бүр өөрөөсөө хамаатайг харна.

**Хугацаа:** ~30 минут (1 удаа CEO хийнэ)

---

## ① Google Sheet үүсгэх (5 минут)

1. https://sheets.google.com нээ
2. **Blank** дээр дарж шинэ Sheet үүсгэх
3. Дээр нэрийг сольж өг: **`Чимун Tasks DB`**
4. Доод зүүн талд "Sheet1" гэдгийг **double-click** дарж нэрийг өгөргө **`tasks`**
5. **Эхний мөрийг (header) дараах байдлаар бөглө:**

   | A | B | C | D | E | F | G | H | I | J | K | L | M | N |
   |---|---|---|---|---|---|---|---|---|---|---|---|---|---|
   | id | title | desc | branch | project | assignee | co_assignees | due | priority | status | kpi_code | createdBy | created | updated |

   > **Анхаар:** Багана нэрс **яг ийм бичиглэлтэй** байх ёстой (lowercase, underscore-той). Нэг үсэг буруу бол sync ажиллахгүй.

6. **URL-аас Sheet ID-г хуулна:**
   
   URL хэлбэр: `https://docs.google.com/spreadsheets/d/SHEET_ID_ХЭСЭГ_ЭНД/edit`
   
   `SHEET_ID_ХЭСЭГ_ЭНД` гэсэн хэсэг нь 44 тэмдэгтийн урт. Жишээ: `1Q2I2bzkMnRzqSDlUFIxv-qGX3bvBmZWvz3iWrEQSnFM`. Хуулж аваарай — дараа n8n-д хэрэгтэй.

---

## ② n8n дээр workflow import хийх (10 минут)

1. https://chimun.app.n8n.cloud (танай n8n) нээ
2. Дээр зүүн талд **`+ Add workflow`** товч даран шинэ workflow үүсгэх
3. Шинэ хуудсан дээр **3-цэгтэй (•••)** товч → **Import from File** сонгох
4. `n8n-workflow-sync.json` файлыг сонгох (та `Desktop/web site & app/АПП ЧИМУН ХХК/n8n-workflow-sync.json` дотор олно)
5. Workflow-н canvas дээр nodes гарч ирнэ. **3 Google Sheets nodes** (улаан анхааруулга харагдана — credentials тохируулах хэрэгтэй).

### Google Sheets credentials тохируулах

a. Эхний улаан node (`Sheets · Read All`) дээр дарна
b. Баруун талд **Credential to connect with** дроп → **Create New Credential**
c. **Sign in with Google** дарна → `ceo@nomaadcamp.com`-аар нэвтрэх → бүх зөвшөөрөл өгнө

   > **Анхаар:** Google Sheet-ийг **тэр имэйлээрээ** үүсгэсэн байх ёстой. Хэрэв өөр имэйлээр Sheet үүсгэсэн бол credentials тохирохгүй учир алдаа гарна.
d. **Save**

(Нөгөө 2 Google Sheets node-д ижил credential автомат сонгогдоно)

### Sheet ID solih

Дээрх 3 Google Sheets node бүрд **Document** хэсэгт `REPLACE_WITH_GOOGLE_SHEET_ID` гэсэн default утгыг **өөрийн Sheet ID-аар** солих:

a. `Sheets · Read All` node дарна
b. **Document** дроп → **By ID** → дээр хуулсан 44-тэмдэгт ID-аа paste
c. Save
d. Үүнийг **Sheets · Upsert**, **Sheets · Soft Delete** node-д ч давтан хийнэ (3 удаа)

### Workflow-г Active болгох

Дээр баруун буланд **Active** toggle-г унтрах байсан бол **асаана**. Workflow одоо webhook хүлээж авна.

### Webhook URL хуулах

1. **Webhook POST /checklist** node дарна
2. Дээр **Production URL** гэсэн хэсэг гарна — энэ URL-ийг хуулна
3. URL хэлбэр: `https://chimun.app.n8n.cloud/webhook/checklist`

---

## ③ Аппад webhook URL оруулах (1 минут)

1. https://gmunkhuchral-debug.github.io/-/ нээ (CEO PIN-ээр нэвтэр)
2. Дээр баруун буланд **⚙ Тохиргоо** товч дарна
3. **n8n Webhook URL** хэсэгт хуулсан webhook URL-ийг paste хийнэ
4. **Хадгалах**
5. Доод баруун буланд **"n8n холбогдсон"** гэж ногоон chip гарвал амжилттай ✅

> **Анхаар:** Энэ Settings нь зөвхөн чиний browser/PWA-д хадгалагдана. Бусад ажилтан тус тусдаа ижил тохиргоог хийх хэрэгтэй. Эсвэл webhook URL-ийг ажилтнуудад тарааж, тэд бүгд ⚙ → URL → хадгалах гэж нэг л удаа тохируулна.

---

## ④ Тестлэх (2 минут)

1. Чи (CEO) шинэ task үүсгэ — жишээ нь Алтансүхэд "Тест" гэх task
2. **Алтансүх** утсаараа аппаа force-close + reopen хий
3. Алтансүх PIN-ээ оруулж нэвтэр
4. ✅ Тэр task Алтансүхэд харагдах ёстой

Хэрэв харагдахгүй бол:
- **n8n** дээр **Executions** хэсэгт алдаа байгаа эсэхийг шалга
- **Google Sheet** дээр шинэ мөр нэмэгдсэн эсэхийг шалга
- App-ийн ⚙ Тохиргооны webhook URL зөв тохируулагдсан эсэхийг шалга

---

## Бэрхшээл гарах гол шалтгаан

| Алдаа | Шийдэл |
|---|---|
| `Локал режим` chip арилахгүй | Webhook URL буруу. ⚙ Тохиргоог дахин шалгах. n8n workflow Active эсэхийг шалга. |
| Sheet дээр task бичигдэж байгаа боловч app-д харагдахгүй | Aggregate Tasks node-ыг шалгаад Read All-ын output schema зөв уу шалга |
| `n8n холбогдсонгүй` гэж байнга гарах | n8n cloud дээр quota дууссан байж магадгүй (free tier 5,000 executions/month). Plan upgrade хэрэгтэй болж болно. |
| 4сар бүрийн KPI sheet рүү очиж байх вэ? | Үгүй — `tasks` нь ТУСДАА Sheet. KPI sheet нь өөр зорилготой, тусдаа байна. |

---

## Ирээдүйн өргөтгөл

Энэ backend бэлэн болсны дараа дараах боломжтой:

1. **Daily reminder cron** — `n8n-workflow-notify.json`-ийг ачаалаад өдөр бүр 09:00 (Asia/Ulaanbaatar timezone-той) хоцорсон/өнөөдрийн task-ыг ажилтан бүрд email/Telegram-аар сануулах
2. **KPI auto-tally** — Сар сүүлд task-уудыг K-кодоор шүүж KPI оноог автоматаар тооцох
3. **5-дамжлагат акт template** — Шинэ захиалга үүсгэх үед автоматаар 5 sub-task үүсгэх
4. **Telegram bot** — Booqable-ийн Telegram chat-тай холбож task шинэчлэлтийг чат руу шилжүүлэх

Backend бэлэн болохоор эдгээр feature-уудыг 1-2 цагт нэмэх боломжтой.

---

## Тэмдэглэл

**Үнэ:** n8n cloud free tier 5,000 executions/month. 23 хүний баг өдөрт 200-300 task үйл ажиллагаа хийвэл сард 6,000-9,000 execution. Plan upgrade ($20/month) хэрэгтэй болж магадгүй. Эсвэл self-hosted n8n руу шилжих.

**Нөөцлөлт:** Google Sheet өөрөө автоматаар хадгалагддаг (revision history). Сар бүр File → Make a copy хийж backup аваарай.

**Аюулгүй байдал:** Webhook URL-г ажилтнуудад тараах нь тэд тэр URL-аар task унших/бичих эрхтэй болно гэсэн үг. Хэн ч URL-г олж авбал бичиж чадна. Энэ нь дотоод систем учир хангалттай. Production-grade хэрэгтэй бол webhook дээр Header Auth тавьж, app-д бас ижил key оруулах боломжтой.
