# Hướng Dẫn Sử Dụng Trang So Sánh Thuật Toán

## 📍 Giới Thiệu

Trang **So sánh Thuật toán** là một công cụ trực quan giúp bạn phân tích và so sánh hiệu suất của 3 thuật toán tìm đường:

- **A\*** (Red) - Tìm đường tối ưu nhất
- **BFS** (Blue) - Tìm đường có ít bước nhất
- **Greedy** (Green) - Tìm đường nhanh nhất nhưng không tối ưu

---

## 🚀 Cách Sử Dụng

### Bước 1: Truy cập trang so sánh

- Từ trang chính, nhấp vào nút **"📊 So sánh Thuật toán"** ở góc trên phải
- Hoặc truy cập trực tiếp: `comparison.html`

### Bước 2: Chọn điểm A (điểm đầu)

- Nhấp một lần trên bản đồ để chọn điểm bắt đầu
- Một marker đỏ sẽ xuất hiện
- Tọa độ sẽ hiển thị ở phần **"📍 Thông tin đường đi"**

### Bước 3: Chọn điểm B (điểm đích)

- Nhấp một lần nữa trên bản đồ để chọn điểm đích
- Một marker xanh sẽ xuất hiện
- Hệ thống sẽ tự động chạy cả 3 thuật toán

### Bước 4: Xem kết quả

Sau khi chọn cả 2 điểm, bạn sẽ thấy:

#### 🗺️ Trên bản đồ:

- **3 đường màu khác nhau** thể hiện đường đi của mỗi thuật toán:
  - 🔴 **A\*** (đường chấm đỏ)
  - 🔵 **BFS** (đường chấm dài xanh)
  - 🟢 **Greedy** (đường chấm ngắn xanh lá)

#### 📊 Ở bảng so sánh:

- **Thời gian thực thi (ms)** - Thuật toán nào chạy nhanh nhất
- **Quãng đường** - Thuật toán nào tìm được đường ngắn nhất
- **Số nút duyệt** - Thuật toán nào duyệt ít nút nhất
- **Thứ hạng** - Vị trí của mỗi thuật toán theo từng tiêu chí

#### 📈 Biểu đồ hiệu suất:

- Biểu đồ cột so sánh **thời gian thực thi** và **quãng đường** giữa 3 thuật toán
- Dễ dàng nhìn thấy đâu là thuật toán tốt nhất cho tình huống này

---

## 🎮 Tính Năng Tương Tác

### Kéo điểm để cập nhật

- Bạn có thể **kéo marker A hoặc B** để thay đổi vị trí
- Hệ thống sẽ **tự động tính toán lại** đường đi mới
- Kết quả cập nhật **ngay lập tức** trên bảng so sánh

### Nút Làm mới

- Nhấp **"🔄 Làm mới"** để xóa tất cả đường đi và bắt đầu lại
- Map sẽ trở về vị trí mặc định

### Nút Xuất kết quả

- Nhấp **"📥 Xuất kết quả"** để tải file JSON chứa dữ liệu chi tiết
- File bao gồm:
  - Tọa độ điểm A và B
  - Thời gian thực thi mỗi thuật toán
  - Quãng đường mỗi thuật toán
  - Danh sách các nút trên đường đi

---

## 📊 Giải Thích Các Cột Dữ Liệu

| Cột                | Ý Nghĩa          | Giải Thích                                                  |
| ------------------ | ---------------- | ----------------------------------------------------------- |
| **Thời gian (ms)** | ⏱️ Mili giây     | Thời gian thuật toán chạy (ms). Càng nhỏ càng nhanh.        |
| **Quãng đường**    | 📏 Đơn vị tọa độ | Tổng khoảng cách của đường đi. Càng nhỏ càng tốt.           |
| **Nút duyệt**      | 🔗 Số lượng      | Số lượng nút được khám phá trong quá trình tìm kiếm.        |
| **Thứ hạng**       | 🏆 1, 2, 3       | Vị trí xếp hạng của thuật toán. 1 = tốt nhất, 3 = kém nhất. |

---

## 🔍 Hiểu Rõ Hơn Về Các Thuật Toán

### A\* (Thuật toán tốt nhất)

- **Ưu điểm**: Tìm được đường **tối ưu nhất** với thời gian **hợp lý**
- **Nhược điểm**: Có thể **chậm hơn** các thuật toán khác nếu duyệt nhiều nút
- **Khi nào dùng**: Khi **chất lượng đường đi** quan trọng nhất

### BFS (Breadth-First Search)

- **Ưu điểm**: Tìm được đường với **số bước ít nhất**
- **Nhược điểm**: Quãng đường **có thể dài hơn** A\* (vì không tính khoảng cách thực)
- **Khi nào dùng**: Khi **số bước nhảy** là tiêu chí quan trọng

### Greedy (Tham lam)

- **Ưu điểm**: **Chạy nhanh nhất** thường, duyệt ít nút
- **Nhược điểm**: **Không đảm bảo** tìm được đường tối ưu, có thể **bị mắc kẹt**
- **Khi nào dùng**: Khi **tốc độ** quan trọng hơn **chất lượng**

---

## 💡 Mẹo Sử Dụng

1. **Thử nhiều cặp điểm khác nhau** để xem thuật toán ứng xử như thế nào trong các tình huống khác nhau

2. **So sánh các đường đi**: Nhìn vào 3 đường trên bản đồ để hiểu tại sao các thuật toán cho kết quả khác nhau

3. **Chú ý những trường hợp đặc biệt**:

   - Khi Greedy tìm được đường tốt (gần bằng A\*)
   - Khi Greedy bị mắc kẹt (đường dài hơn nhiều)
   - Khi BFS tìm được đường có ít bước nhưng dài hơn quãng đường

4. **Xuất dữ liệu** để phân tích chi tiết sau này hoặc so sánh giữa nhiều lần chạy khác nhau

---

## ❓ Các Câu Hỏi Thường Gặp

**Q: Tại sao thuật toán X lâu hơn Y mặc dù kết quả tốt hơn?**
A: Vì thuật toán X phải duyệt nhiều nút hơn để đảm bảo tìm được đường tốt nhất.

**Q: Tôi có thể ghim một cặp điểm để so sánh lại không?**
A: Hiện tại chưa có tính năng này, nhưng bạn có thể xuất kết quả để lưu trữ.

**Q: Đường đi của các thuật toán có chính xác không?**
A: Có, tất cả đều chạy trên cơ sở dữ liệu bản đồ thực từ OpenStreetMap.

**Q: Bản đồ nào được sử dụng?**
A: Mặc định là OpenStreetMap. Bạn có thể chuyển sang bản đồ khác (Satellite) ở góc trái trên.

---

## 📱 Tương Thích

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (responsive design)
- ⚠️ Mobile (giao diện tối ưu hóa nhưng có thể khó sử dụng trên màn hình nhỏ)

---

## 🔗 Liên Kết Nhanh

- 🏠 Quay lại trang chính: `index.html`
- 📊 So sánh thuật toán: `comparison.html` (trang hiện tại)
- 📁 Xuất dữ liệu: Nhấp nút "📥 Xuất kết quả"

---

**Thíc một tính năng mới hay phát hiện lỗi?** Vui lòng liên hệ để cải thiện!
