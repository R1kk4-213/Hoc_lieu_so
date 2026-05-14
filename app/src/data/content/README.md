# Hướng dẫn chỉnh sửa nội dung bài học (cho Giáo viên)

Tất cả **nội dung câu hỏi, đáp án, gợi ý, lý thuyết, hình ảnh, thứ tự các bước** đều nằm trong thư mục này dưới dạng các file **JSON**. Bạn KHÔNG cần biết lập trình — chỉ cần mở file bằng Notepad / VS Code, sửa chữ trong dấu ngoặc kép, lưu lại, rồi reload web.

## 📂 Cấu trúc thư mục

```
src/data/content/
├─ bai1.json         ← Bài 1: Tập hợp
├─ bai2.json         ← Bài 2: Tập hợp con
├─ bai3.json         ← Bài 3: Hai tập hợp bằng nhau
├─ bai4.json         ← Bài 4: Các tập hợp số
├─ bai5.json         ← Bài 5: Tập con của ℝ
├─ bai7.json         ← Bài 7: Đếm phần tử n(A∪B)
├─ operations.json   ← Bài 6: Game phép giao / hợp / hiệu
└─ README.md         ← (File này)
```

> 💡 **Ảnh minh hoạ** nằm ở `app/public/images/`. Để dùng ảnh mới, copy ảnh vào folder đó rồi tham chiếu `"image": "/images/ten-anh.png"` trong JSON.

## 🧰 Quy tắc cú pháp JSON (phải nhớ!)

JSON rất nghiêm về dấu phẩy và dấu ngoặc. Sai 1 dấu là cả file lỗi. Quy tắc:

1. **Chuỗi (text) phải nằm trong dấu nháy kép** `"..."` — không dùng nháy đơn `'...'`.
2. **Dấu phẩy** ngăn cách các mục trong mảng `[...]` hoặc object `{...}`, nhưng **không có dấu phẩy sau mục cuối cùng**.
3. **Kí tự đặc biệt trong text** phải escape:
   - Dấu nháy kép: `\"`
   - Dấu `\` (gạch chéo ngược): `\\` — ví dụ `S \\ T` để hiển thị `S \ T`
   - Xuống dòng: `\n`
4. **Kí tự toán học** (∈, ∉, ⊂, ⊃, ∩, ∪, ℕ, ℤ, ℚ, ℝ, ∅, ≤, ≥, …) gõ trực tiếp được — file JSON là UTF-8.

✅ **Đúng**: `"text": "Cho tập hợp S = { 2; 3 }"`
❌ **Sai**: `'text': 'Cho tập hợp S = { 2; 3 },'` (nháy đơn, dấu phẩy thừa)

> Mẹo: dùng VS Code mở file `.json`. Nó sẽ tô đỏ chỗ lỗi cú pháp ngay khi bạn gõ sai.

## 🏗️ Cấu trúc một bài học (Bài 1-5, 7)

Mỗi file `baiN.json` có dạng:

```json
{
  "id": "bai1",
  "number": "Bài 1",
  "title": "Tập hợp",
  "steps": [
    { ...bước 1... },
    { ...bước 2... },
    { ...bước 3... }
  ]
}
```

**Để thêm / xoá / đổi thứ tự bước**: chỉ cần thêm, bớt hoặc kéo-thả các object `{...}` trong mảng `"steps"`. Học sinh sẽ đi qua các bước theo đúng thứ tự trong mảng.

### 📋 9 loại bước (`kind`) có sẵn

| `kind` | Mô tả |
|---|---|
| `intro` | Trang giới thiệu / dẫn nhập, chỉ có chữ + bullet |
| `theory` | Trang lý thuyết (có công thức, bullet, ghi chú, ảnh) |
| `classify` | Kéo-thả nhân vật / vật vào nhiều ô (kèm ảnh minh hoạ) |
| `true-false` | Đúng/Sai cho từng mệnh đề |
| `pick-symbol` | Chọn kí hiệu (vd: ∈ hay ∉) cho từng dòng |
| `free-answer` | Học sinh tự nhập đáp án (liệt kê hoặc số) |
| `multi-tick` | Chọn nhiều phương án đúng |
| `interval-match` | Viết kí hiệu khoảng / đoạn / nửa khoảng |
| `word-problem` | Bài toán có lời văn, học sinh nhập 1 số + lời giải |

### 📝 Mẫu chi tiết cho từng loại

#### 1. `intro` — Trang giới thiệu

```json
{
  "kind": "intro",
  "title": "Tiêu đề",
  "body": "Đoạn dẫn nhập, viết tự do.",
  "bullets": [
    "Ý 1",
    "Ý 2"
  ]
}
```

`bullets` là **tuỳ chọn** — bỏ đi cũng được.

#### 2. `theory` — Trang lý thuyết

```json
{
  "kind": "theory",
  "title": "Lý thuyết — Tập hợp con",
  "body": "Nếu mọi phần tử của T đều là phần tử của S thì T ⊂ S.",
  "formula": "T ⊂ S ⇔ ∀x, x ∈ T ⇒ x ∈ S",
  "bullets": ["Quy ước: ∅ là tập con của mọi tập hợp."],
  "note": "Đây là ghi chú nhỏ ở dưới (màu cam).",
  "image": "/images/venn-intersect.png"
}
```

Tất cả các trường ngoài `kind`, `title`, `body` đều **tuỳ chọn**.

#### 3. `classify` — Kéo thẻ vào các ô

```json
{
  "kind": "classify",
  "prompt": "Kéo từng nhân vật vào TẤT CẢ các nhóm phù hợp.",
  "buckets": [
    {
      "id": "A",
      "label": "A · Phim Conan",
      "description": "Nhân vật trong phim Conan.",
      "image": "/images/box-conan.png"
    },
    { "id": "B", "label": "B · Phim Doraemon", "image": "/images/box-doraemon.png" }
  ],
  "items": [
    { "id": "conan", "text": "Conan", "targets": ["A", "D"] },
    { "id": "suneo", "text": "Suneo", "targets": ["B"] },
    { "id": "ronaldo", "text": "Ronaldo", "targets": [] }
  ]
}
```

- `buckets`: các ô. **`id` của bucket** dùng để liên kết với `targets` của thẻ.
- `items`: các thẻ kéo. **`targets`** = danh sách các bucket-id mà thẻ này thuộc về.
  - 1 ô → thẻ chỉ kéo vào 1 ô đó
  - Nhiều ô → thẻ kéo vào tất cả các ô đó
  - `[]` (rỗng) → thẻ không thuộc ô nào, học sinh phải nhận ra (hiển thị mờ trong khay)

#### 4. `true-false`

```json
{
  "kind": "true-false",
  "prompt": "Đúng hay Sai?",
  "statements": [
    {
      "id": "s1",
      "text": "Mọi hình vuông đều là hình thoi.",
      "answer": true,
      "explain": "Đúng — hình vuông có 4 cạnh bằng nhau."
    }
  ]
}
```

- `answer`: `true` (Đúng) hoặc `false` (Sai)
- `explain` là **tuỳ chọn** — hiển thị sau khi học sinh trả lời.

#### 5. `pick-symbol` — Chọn ∈ / ∉ (hoặc bất kì 2 kí hiệu nào)

```json
{
  "kind": "pick-symbol",
  "prompt": "Điền ∈ hoặc ∉.",
  "options": ["∈", "∉"],
  "rows": [
    { "id": "r1", "left": "Ran", "right": "B", "answer": 1, "explain": "Ran không có trong Doraemon." }
  ]
}
```

- `options`: 2 kí hiệu (vị trí 0 và 1). Có thể đổi thành `["⊂", "⊄"]`, `["=", "≠"]` v.v.
- `answer`: `0` nếu đáp án là kí hiệu đầu (∈), `1` nếu là kí hiệu sau (∉).

#### 6. `free-answer` — Học sinh tự nhập

```json
{
  "kind": "free-answer",
  "prompt": "Liệt kê các phần tử.",
  "fields": [
    {
      "key": "D",
      "label": "D = { … }",
      "answers": [["Conan", "Nobita"]],
      "placeholder": "vd: Conan, Nobita"
    },
    {
      "key": "nA",
      "label": "n(A) = ?",
      "answers": [[4]],
      "single": true
    }
  ]
}
```

- `answers`: **mảng các đáp án chấp nhận được**. Mỗi đáp án là 1 mảng các phần tử. So sánh không phân biệt thứ tự, không phân biệt hoa thường, bỏ qua dấu tiếng Việt.
- `single: true` → chỉ chấp nhận đúng 1 giá trị (như n(A) = 4).
- Có thể thêm nhiều đáp án chấp nhận: `"answers": [[1,2,3], [1, 2, 3]]`.

#### 7. `multi-tick` — Chọn nhiều phương án

```json
{
  "kind": "multi-tick",
  "prompt": "Đâu là tập con của S = {2; 3; 5}?",
  "options": [
    { "id": "o1", "text": "{ 3 }", "correct": true },
    { "id": "o2", "text": "{ 0; 2 }", "correct": false },
    { "id": "o3", "text": "{ 3; 5 }", "correct": true }
  ],
  "explanation": "S₁ và S₃ chỉ chứa phần tử của S nên là tập con."
}
```

Học sinh tick tất cả các phương án `"correct": true` — không tick các `false` — mới được công nhận đúng.

#### 8. `interval-match` — Viết kí hiệu khoảng / đoạn

```json
{
  "kind": "interval-match",
  "prompt": "Viết tập hợp dưới dạng khoảng / đoạn.",
  "rows": [
    {
      "id": "r1",
      "description": "{ x ∈ ℝ | 2 < x < 5 }",
      "answers": ["(2;5)", "(2; 5)"]
    }
  ]
}
```

`answers` chứa nhiều cách viết chấp nhận (có/không khoảng trắng). Hệ thống tự bỏ khoảng trắng và đổi `vc` → `∞` để dễ nhập.

#### 9. `word-problem` — Bài toán lời văn

```json
{
  "kind": "word-problem",
  "prompt": "Có bao nhiêu bạn?",
  "setup": "Gọi x là... Khi đó số bạn chỉ đá bóng là 16-x...",
  "answer": 3,
  "unit": "bạn",
  "solution": "Lời giải chi tiết..."
}
```

Học sinh nhập 1 số. `unit` (đơn vị) là tuỳ chọn. Nút "Xem lời giải" hiển thị nội dung `solution`.

---

## 🎮 Cấu trúc Bài 6 (Game phép toán) — `operations.json`

Bài 6 là **mini-game kéo-thả** chứ không phải lesson tuần tự, nên cấu trúc khác:

```json
{
  "maxHintsPerLevel": 2,
  "maxMistakesPerLevel": 3,
  "levels": [
    { ...Màn 1... },
    { ...Màn 2... },
    { ...Màn 3... },
    { ...Màn 4... }
  ]
}
```

- `maxHintsPerLevel`: số lần gợi ý tối đa cho mỗi màn.
- `maxMistakesPerLevel`: số lần thả sai tối đa trước khi phải làm lại.

### Cấu trúc mỗi `level`

```json
{
  "id": 1,
  "title": "Phép giao",
  "topic": "Mạng xã hội",
  "scenario": "Hãy kéo các ứng dụng vào đúng vùng...",
  "labelA": "Nhắn tin / Gọi điện",
  "labelB": "Xem video ngắn",
  "effect": "intersect",
  "popupTitle": "Bạn vừa khám phá ra Phép Giao!",
  "popupText": "Facebook và Instagram làm được CẢ HAI...",
  "definition": {
    "body": "Tập hợp gồm các phần tử thuộc CẢ HAI...",
    "formula": "S ∩ T = { x | x ∈ S và x ∈ T }",
    "setNames": ["S", "T"],
    "image": "/images/venn-intersect.png",
    "imageCaption": "S ∩ T"
  },
  "items": [
    { "id": "c1", "text": "💬 Messenger", "target": "A", "hint": "Cái này chỉ nhắn tin." }
  ],
  "discovery": {
    "prompt": "Từ bài làm, ứng dụng nào vừa gọi điện vừa xem video ngắn?",
    "fieldLabel": "Đáp án của bạn",
    "placeholder": "vd: Facebook, Instagram",
    "answers": [["Facebook", "Instagram"]],
    "revealNote": "Đây là thẻ ở vùng giữa."
  }
}
```

- `effect`: một trong `"intersect"` (giao), `"union"` (hợp), `"difference"` (hiệu), `"math"` (màn cuối — fill-in thuần, không kéo).
- `items`: thẻ bài. `target` là `"A"` (chỉ A), `"B"` (chỉ B), hoặc `"AB"` (vùng giao).
- `discovery`: câu hỏi khám phá hiện sau khi xếp xong (Màn 1-3).
- `fillIn`: dành cho **màn `"math"`** — câu hỏi điền kết quả (xem `operations.json` Màn 4 làm mẫu).

---

## 🚀 Quy trình chỉnh sửa

1. **Backup** file gốc trước khi sửa (copy thành `bai1.backup.json` chẳng hạn).
2. Mở file bằng **VS Code** (khuyên dùng — tự highlight lỗi).
3. Sửa nội dung trong dấu nháy `"..."`.
4. Lưu file.
5. Nếu đang chạy `npm run dev`: web tự reload — kiểm tra ngay.
6. Khi triển khai chính thức: chạy `npm run build` để build lại.

> ⚠️ Nếu sau khi sửa mà **trang trắng** hoặc lỗi: 99% là cú pháp JSON. Mở [JSONLint](https://jsonlint.com) → paste nội dung file → bấm Validate. Nó sẽ chỉ rõ dòng nào lỗi.

## 🖼️ Thêm ảnh mới

1. Bỏ file ảnh (PNG/JPG/SVG) vào `app/public/images/`.
2. Trong JSON, tham chiếu `"image": "/images/ten-anh.png"` (đường dẫn bắt đầu bằng `/`).

## ❓ FAQ

**Q: Có thể thêm bài thứ 8, 9, 10 không?**
A: Có. Tạo file mới `bai8.json` (cùng cấu trúc bai1.json), rồi thêm 2 dòng vào:
- `src/data/lessons.ts`: `import bai8 from "./content/bai8.json";` và thêm vào `LESSONS`.
- `src/components/Home.tsx`: thêm 1 thẻ chương trong mảng `CHAPTERS`.

**Q: Đổi tiêu đề trang chủ thế nào?**
A: Sửa file `src/components/Home.tsx` — nằm trong h1, dễ tìm.

**Q: Tại sao chỉ định nhiều `answers`?**
A: Để chấp nhận nhiều cách viết. Ví dụ học sinh nhập "Facebook, Instagram" hoặc "Instagram; Facebook" đều OK vì so sánh không phân biệt thứ tự, hoa thường, dấu tiếng Việt.

**Q: Học sinh trả lời sai có hiện đáp án không?**
A: Mỗi loại bước đều có nút "Sửa lại" / "Làm lại" để thử lại. Riêng `pick-symbol` và `true-false` có trường `explain` để giáo viên giải thích sau khi học sinh sai.

---

Mọi thắc mắc khác, liên hệ team phát triển. Chúc các thầy cô soạn bài vui!
