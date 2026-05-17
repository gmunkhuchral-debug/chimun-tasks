# n8n Finance Sync workflow — setup заавар

**Зорилго:** Финансын хүсэлтийг ТУСДАА Sheet (`Чимун_Финанс_Хүсэлт`)-д хадгалах.
**Хугацаа:** ~5 минут

---

## Хийгдсэн зүйлс

✅ Шинэ Sheet үүсгэгдсэн: [Чимун_Финанс_Хүсэлт](https://docs.google.com/spreadsheets/d/1ogJTucQ9BipiJU_kckjS4DmJ7b0BJbh1_eXuoLWZNEI/edit) (18 баганат бүрэн schema-тай)
✅ App refactor хийгдсэн: `state.financeRequests` array, `loadFinanceRequests()`, `saveFinanceRequest()` функцууд
✅ n8n workflow JSON бэлэн: `n8n-workflow-finance.json` (Sheet ID хатуу бичигдсэн)

---

## ❶ Tasks DB Sheet-ээс 9 финансын баганаа хасах

[Чимун_Tasks_DB](https://docs.google.com/spreadsheets/d/1dWEAkx2KkIEwfJ3ERmCpWpQF7sxdqyag7hevsv39ZRc/edit) нээх. Header мөрд **9 финансын багана** үлдсэн байгаа:

`amount, purpose, beneficiary, justification, decision, decision_at, decision_by, executed_at, executed_by`

Тэдгээрийн **бүх багана сонгож delete хийх**:

1. R багана (`amount`) header дээр товших
2. Shift + click Z багана (`executed_by`) — 9 багана сонгогдоно
3. Right-click → **Delete 9 columns**

Үлдэх ёстой header (17 багана):
```
id, title, desc, branch, project, assignee, co_assignees, due, priority,
status, kpi_code, createdBy, parent_id, kind, stage, created, updated
```

## ❷ Tasks Sheet tab нэрийг шалгах

Чимун_Финанс_Хүсэлт-н доод зүүн tab нэрийг **`tasks`** болгож rename хийх (default нь "Хуудас1" байж магадгүй). Workflow `tasks` гэсэн tab нэртэй холбогдоно.

## ❸ n8n дотор Finance workflow import

1. n8n Cloud → **+ Add workflow → Import from File**
2. Файл сонгох: `/Users/munkhuchralganbat/Desktop/web site & app/АПП ЧИМУН ХХК/n8n-workflow-finance.json`
3. **3 Sheets node** бүрд (Read Finance, Upsert Finance, Soft Delete) **credential холбох**
4. **Execute Workflow** → `{"requests":[]}` хариу гарах ёстой
5. **Active toggle** асаах
6. **Webhook POST /finance** node → Production URL хуулах:
   ```
   https://chimun.app.n8n.cloud/webhook/finance
   ```

## ❹ Хуучин Tasks sync workflow update

n8n-ийн **Чимун Tasks · Sync** (одоо ажиллаж байгаа) workflow-ын `Sheets · Upsert` node-аас доорх **9 талбарыг хасах** (хэрэв нэмсэн бол):
- amount, purpose, beneficiary, justification, decision, decision_at, decision_by, executed_at, executed_by

Эсвэл `n8n-workflow-sync.json`-ыг дахин import хийх — бид уг файлаас санхүүгийн талбаруудыг хассан.

## ❺ App-ын Settings-д Finance URL тавих

1. https://gmunkhuchral-debug.github.io/chimun-tasks/ нээх (GitHub push-ийн дараа)
2. **⚙ Тохиргоо** → **n8n Finance Webhook URL** талбарт:
   ```
   https://chimun.app.n8n.cloud/webhook/finance
   ```
3. **Хадгалах**

App автомат refresh хийгээд **💸 Хүсэлт** view-д хүсэлтүүд харагдана.

---

## ⚠ Хуучин t_zdk77... хүсэлт яах вэ?

Tasks DB Sheet дотор үүссэн хуучин финансын хүсэлт (`t_zdk77...`) Финанс sheet-руу автомат шилжихгүй. 2 хувилбар:

**A) Гарт хуулах:** Tasks DB row-аас мэдээллийг авч шинэ Финанс Sheet-д row нэмэх (id-г шинээр үүсгэх, дүн, хүлээн авагч, зорилго бүгдийг бичих).

**B) Орхих:** Тэр хүсэлтийг устгаад шинэчилж дахин үүсгэх (app-аас 💸 Хүсэлт дарж).

**Миний санал B** — тэр нь туршилт хүсэлт байсан болохоор.

---

## Эх схем
**Tasks DB (17 багана):** task-уудын үндсэн жагсаалт
**Finance Sheet (18 багана):** id, requested_by, requested_at, amount, beneficiary, purpose, justification, due_date, status, decision, decision_at, decision_by, decision_reason, executed_at, executed_by, executor, payment_proof_url, updated
**Master Sheet (18 багана):** Ажилтны бүртгэл (өмнөх setup)

3 Sheet тус тусдаа Audit trail, аль ч хэсгийн өгөгдөл бусдыг бохирдуулахгүй.
