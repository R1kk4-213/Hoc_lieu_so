# Tập Hợp Lab — Hướng dẫn chạy trên Windows

Trang web học liệu Toán 10 (chủ đề Tập Hợp) — kéo thả thẻ vào sơ đồ Venn.
Hướng dẫn này dành cho **người chưa biết gì về lập trình**. Cứ làm tuần tự theo các bước, mỗi bước chỉ vài cú click chuột.

---

## 1. Cài Node.js (chỉ làm 1 lần duy nhất)

Node.js là phần mềm cần thiết để chạy web. Nếu máy bạn đã cài rồi thì có thể bỏ qua bước này.

1. Mở trình duyệt, vào: **https://nodejs.org**
2. Bấm nút màu xanh lá **LTS** (phiên bản ổn định).
3. Tải xong, mở file `.msi` vừa tải về.
4. Bấm **Next → Next → Next → Install** (giữ nguyên tất cả mặc định).
5. Khi cài xong, bấm **Finish**.

> **Cách kiểm tra cài thành công:** nhấn phím `⊞ Windows`, gõ `cmd`, mở **Command Prompt**, gõ:
> ```
> node -v
> ```
> Nếu hiện ra dòng kiểu `v20.19.2` là OK.

---

## 2. Tải mã nguồn của project về máy

**Cách dễ nhất — tải file ZIP:**

1. Vào trang GitHub của project (hoặc lấy file ZIP người gửi đưa).
2. Bấm nút xanh **Code → Download ZIP**.
3. Vào thư mục **Downloads**, chuột phải vào file ZIP vừa tải → **Extract All...** → **Extract**.
4. Sau khi giải nén bạn sẽ thấy thư mục dạng `atus-main` (hoặc tên tương tự). Mở vào trong, sẽ thấy thư mục con tên `app` — đây là cái mình cần.

---

## 3. Mở Command Prompt đúng vào thư mục `app`

1. Mở thư mục `app` trong **File Explorer**.
2. Click chuột vào **thanh địa chỉ** ở trên cùng (chỗ hiện đường dẫn), nó sẽ chuyển thành text bôi đen.
3. Xoá hết, gõ chữ `cmd` rồi nhấn **Enter**.
4. Một cửa sổ đen (Command Prompt) sẽ mở ra, đã trỏ sẵn vào thư mục `app`.

---

## 4. Cài các thư viện cần thiết (chỉ làm 1 lần)

Trong cửa sổ đen vừa mở, gõ lệnh sau rồi nhấn **Enter**:

```
npm install
```

Đợi 1–3 phút, máy sẽ tự tải các gói cần thiết. Khi nào thấy hiện lại dấu `>` ở đầu dòng (không còn chữ chạy nữa) là xong.

> Nếu thấy chữ vàng cảnh báo `WARN` thì kệ nó, không phải lỗi.
> Chỉ khi thấy chữ đỏ `ERR!` mới cần để ý.

---

## 5. Chạy web

Trong cùng cửa sổ đen đó, gõ:

```
npm run dev
```

Sau vài giây sẽ hiện dòng:

```
  ➜  Local:   http://localhost:5173/
```

Mở trình duyệt (Chrome / Edge / Firefox), gõ địa chỉ **http://localhost:5173** rồi Enter — bạn sẽ thấy web hiện ra.

### Cách dừng:
Quay lại cửa sổ đen, nhấn tổ hợp `Ctrl + C`, gõ `Y` rồi Enter.

### Lần sau muốn chạy lại:
Chỉ cần làm **Bước 3** + **Bước 5** — không phải cài lại từ đầu.

---

## ❓ Gặp lỗi thường gặp

| Lỗi | Cách xử lý |
|---|---|
| `'npm' is not recognized` | Bạn chưa cài Node.js, hoặc cần đóng/mở lại Command Prompt sau khi cài xong. |
| `Port 5173 is in use` | Có web khác đang chạy. Chạy lệnh `npm run dev -- --port 5180` để đổi cổng. |
| Web mở ra nhưng trắng tinh | Bấm `Ctrl + F5` để load lại không cache. Vẫn lỗi thì gõ `Ctrl + C` ở cửa sổ đen rồi chạy lại `npm run dev`. |
| Máy báo virus / SmartScreen chặn | Đó là cảnh báo nhầm khi cài Node.js. Bấm **More info → Run anyway**. |

---

## 📁 Các thư mục bên trong

```
app/
├─ src/
│  ├─ components/        ← Code giao diện (đừng sửa nếu không biết lập trình)
│  └─ data/
│     ├─ content/        ← 🔥 NỘI DUNG BÀI HỌC — sửa ở đây!
│     │  ├─ bai1.json    ← Bài 1: Tập hợp
│     │  ├─ bai2.json    ← Bài 2: Tập hợp con
│     │  ├─ bai3.json    ← Bài 3: Hai tập hợp bằng nhau
│     │  ├─ bai4.json    ← Bài 4: Các tập hợp số
│     │  ├─ bai5.json    ← Bài 5: Tập con của ℝ
│     │  ├─ bai7.json    ← Bài 7: Đếm phần tử
│     │  ├─ operations.json  ← Bài 6: Game phép giao/hợp/hiệu
│     │  └─ README.md    ← 📖 Hướng dẫn sửa nội dung (bắt buộc đọc)
│     ├─ lessons.ts      ← Loader (đừng đụng vào)
│     └─ gameData.ts     ← Loader (đừng đụng vào)
├─ public/
│  └─ images/            ← Ảnh minh hoạ — bỏ ảnh mới vào đây để dùng trong JSON
├─ package.json
└─ README.md             ← (File này)
```

---

## 📝 Sửa câu hỏi, đáp án, thứ tự bài học

Bạn KHÔNG cần biết lập trình. Toàn bộ câu hỏi, đáp án, gợi ý, lý thuyết, ảnh,
thứ tự các bước đều nằm trong các file **JSON** ở `src/data/content/`.

**👉 Đọc hướng dẫn chi tiết tại: [`src/data/content/README.md`](src/data/content/README.md)**

Quy trình:
1. Mở file JSON cần sửa (vd: `bai1.json`) bằng **VS Code**.
2. Sửa text trong dấu nháy `"..."` — cẩn thận giữ dấu phẩy và dấu ngoặc.
3. Lưu (Ctrl+S). Nếu `npm run dev` đang chạy, web tự reload.
4. Khi xong, chạy `npm run build` để build bản chính thức.

> Nếu sửa xong web trắng tinh → lỗi cú pháp JSON. Vào [jsonlint.com](https://jsonlint.com), paste file vào, bấm Validate — sẽ chỉ rõ dòng nào sai.

---

## 🚀 Muốn chia sẻ cho người khác xem (tuỳ chọn)

Nếu muốn build ra bản gọn để upload lên hosting (Netlify, Vercel, GitHub Pages…), chạy:

```
npm run build
```

Xong sẽ có thư mục `dist/` — đó là toàn bộ web đã đóng gói, chỉ cần kéo lên hosting là chạy.

---

Mọi vấn đề khác cứ chụp màn hình cửa sổ đen gửi cho người chuyển project. 🎓
