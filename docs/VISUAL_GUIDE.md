# 📊 Visual Guide - Trang So Sánh Thuật Toán

## 🎨 Giao Diện Tổng Quan

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🗺️ So sánh Thuật toán Tìm đường                     [← Quay lại] [🔄]  │
│  Phân tích hiệu suất A*, BFS và Greedy trên bản đồ Hà Nội               │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┬──────────────────────────────────┐
│                                      │  📍 Thông tin đường đi            │
│                                      │  ┌──────────────────────────────┐ │
│         LEAFLET MAP                  │  │ Điểm đầu: Chưa chọn         │ │
│         (Click để chọn)              │  │ Điểm đích: Chưa chọn        │ │
│                                      │  └──────────────────────────────┘ │
│    • 🔴 Marker A (Red)               │                                   │
│    • 🔵 Marker B (Blue)              │  ⚡ Kết quả So sánh             │
│    • 🔴 A* path (dashed)             │  ┌──────────────────────────────┐ │
│    • 🔵 BFS path (long-dash)         │  │ 🔴 A* ✓ Thành công          │ │
│    • 🟢 Greedy path (dot-dash)       │  │ ⏱️ 2.45ms  📏 0.023  🔗 12  │ │
│                                      │  │ Rank: ① ①                   │ │
│                                      │  ├──────────────────────────────┤ │
│    [Zoom controls]                   │  │ 🔵 BFS ✓ Thành công         │ │
│    [Layer selector]                  │  │ ⏱️ 3.12ms  📏 0.026  🔗 15  │ │
│                                      │  │ Rank: ② ②                   │ │
│                                      │  ├──────────────────────────────┤ │
│                                      │  │ 🟢 Greedy ✓ Thành công      │ │
│                                      │  │ ⏱️ 1.89ms  📏 0.029  🔗 8   │ │
│                                      │  │ Rank: ① ③                   │ │
│                                      │  └──────────────────────────────┘ │
│                                      │                                   │
│  💡 Click để chọn điểm A và B       │  📊 Biểu đồ Thời gian            │
│  🖐️ Kéo marker để cập nhật          │  ┌──────────────────────────────┐ │
│                                      │  │      [Bar Chart]             │ │
│                                      │  │   A*  BFS  Greedy            │ │
│                                      │  │   ▄▄   ▄▄   ▄▄               │ │
│                                      │  │                              │ │
│                                      │  └──────────────────────────────┘ │
│                                      │                                   │
│                                      │  🏆 Tóm tắt hiệu suất            │
│                                      │  ┌──────────────────────────────┐ │
│                                      │  │ Alg │Thời gian│Quãng đ│Nút  │ │
│                                      │  │─────┼─────────┼───────┼─────│ │
│                                      │  │A*   │①2.45ms │①0.023│②12 │ │
│                                      │  │BFS  │②3.12ms │②0.026│③15 │ │
│                                      │  │Grd  │①1.89ms │③0.029│①8  │ │
│                                      │  └──────────────────────────────┘ │
│                                      │ [🔄 Làm mới] [📥 Xuất kết quả] │
└──────────────────────────────────────┴──────────────────────────────────┘
```

---

## 🔴 🔵 🟢 Các Loại Đường

### A\* Algorithm (Red)

```
Polyline Style:
- Color: #ff6b6b (Red)
- Weight: 3px
- Pattern: Dashed (5px dashes)
- Opacity: 0.8
- Purpose: Đường tối ưu nhất
```

### BFS Algorithm (Blue)

```
Polyline Style:
- Color: #4dabf7 (Blue)
- Weight: 3px
- Pattern: Long dashes (10, 5)
- Opacity: 0.8
- Purpose: Đường ít bước nhất
```

### Greedy Algorithm (Green)

```
Polyline Style:
- Color: #51cf66 (Green)
- Weight: 3px
- Pattern: Short dashes (2, 5)
- Opacity: 0.8
- Purpose: Đường nhanh nhất
```

---

## 📊 Stats Cards Breakdown

### Card 1: Thông tin đường đi

```
┌─ 📍 Thông tin đường đi
│
├─ Điểm đầu (Start Point)
│  [Chưa chọn] → Hiển thị tọa độ sau khi chọn
│
└─ Điểm đích (End Point)
   [Chưa chọn] → Hiển thị tọa độ sau khi chọn
```

### Card 2: Kết quả So sánh

```
┌─ ⚡ Kết quả So sánh
│
├─ Algorithm Result Item (A*)
│  ├─ Badge: 🔴 Màu đỏ
│  ├─ Name: A*
│  ├─ Status: ✓ Thành công (green)
│  ├─ Metrics:
│  │  ├─ ⏱️ Thời gian: 2.45 ms
│  │  ├─ 📏 Quãng đường: 0.023
│  │  └─ 🔗 Số nút: 12
│  └─ Ranking:
│     ├─ 🥇 Rank 1 (Thời gian)
│     └─ 🥇 Rank 1 (Quãng đường)
│
├─ Algorithm Result Item (BFS)
│  └─ (Tương tự A*)
│
└─ Algorithm Result Item (Greedy)
   └─ (Tương tự A*)
```

### Card 3: Biểu Đồ

```
┌─ 📊 Biểu đồ Thời gian thực thi
│
├─ Chart Type: Bar Chart (Stacked)
├─ Dataset 1: Execution Time (ms)
│  ├─ A*: 2.45
│  ├─ BFS: 3.12
│  └─ Greedy: 1.89
│
├─ Dataset 2: Path Distance (normalized)
│  ├─ A*: 2.34
│  ├─ BFS: 2.57
│  └─ Greedy: 2.89
│
└─ Y-Axes:
   ├─ Left (y): Time in ms
   └─ Right (y1): Distance (normalized)
```

### Card 4: Bảng Tóm Tắt

```
┌─ 🏆 Tóm tắt hiệu suất
│
├─ Header Row:
│  ├─ Thuật toán
│  ├─ Thời gian (ms)
│  ├─ Quãng đường
│  └─ Nút duyệt
│
├─ Data Row 1 (A*):
│  ├─ Badge: 🥇 (Gold - Rank 1)
│  ├─ Time: 2.45 ms
│  ├─ Distance: ① 0.023
│  └─ Nodes: ② 12
│
├─ Data Row 2 (BFS):
│  └─ (Tương tự)
│
├─ Data Row 3 (Greedy):
│  └─ (Tương tự)
│
└─ Action Buttons:
   ├─ 🔄 Làm mới (Gray button)
   └─ 📥 Xuất kết quả (Purple button)
```

---

## 🎮 User Interactions

### Scenario 1: Chọn Điểm Đầu

```
User: Nhấp trên bản đồ (ví dụ: 21.005, 105.851)
             ↓
System: nearestNeighbour(21.005, 105.851)
             ↓
Response: { id: "123", lat: 21.00512, lon: 105.85123 }
             ↓
Display:
  ✅ Marker đỏ xuất hiện tại vị trí
  ✅ Card "Thông tin đường đi" cập nhật: "Điểm đầu: [21.00512, 105.85123]"
  ✅ pointCount++
```

### Scenario 2: Chọn Điểm Kết Thúc (Kích Hoạt So Sánh)

```
User: Nhấp trên bản đồ lần thứ 2 (ví dụ: 21.010, 105.856)
             ↓
System: nearestNeighbour(21.010, 105.856)
             ↓
Response: { id: "456", lat: 21.01012, lon: 105.85612 }
             ↓
Display:
  ✅ Marker xanh xuất hiện
  ✅ Card "Thông tin đường đi" cập nhật: "Điểm đích: [21.01012, 105.85612]"
             ↓
runComparison() bắt đầu:
  ✅ isLoading = true
  ✅ Hiển thị loading spinner
  ✅ Chạy 3 thuật toán song song
             ↓
Results trả về:
  ✅ Vẽ 3 polyline trên bản đồ
  ✅ Cập nhật stats card
  ✅ Render biểu đồ
  ✅ Cập nhật bảng ranking
             ↓
isLoading = false
```

### Scenario 3: Kéo Marker

```
User: Kéo marker A đến vị trí mới
             ↓
onMarkerDragEnd():
  ✅ updatePointDisplay()
  ✅ runComparison() (tự động chạy lại)
             ↓
(Tương tự Scenario 2)
```

### Scenario 4: Làm Mới

```
User: Nhấp "🔄 Làm mới"
             ↓
resetComparison():
  ✅ Xóa marker A & B
  ✅ Xóa 3 polyline
  ✅ Reset pointCount
  ✅ Cập nhật UI về trạng thái ban đầu
  ✅ Destroy chart cũ
  ✅ Reset bảng dữ liệu
  ✅ Map zoom/center về vị trí mặc định
```

### Scenario 5: Xuất Kết Quả

```
User: Nhấp "📥 Xuất kết quả"
             ↓
exportResults():
  ✅ Tạo object JSON:
     {
       timestamp: "2025-11-28T...",
       startPoint: { lat: 21.005, lng: 105.851 },
       endPoint: { lat: 21.010, lng: 105.856 },
       algorithms: {
         astar: { executionTime: "2.45", pathLength: 12, ... },
         bfs: { executionTime: "3.12", ... },
         greedy: { executionTime: "1.89", ... }
       }
     }
  ✅ Convert to Blob
  ✅ Create download link
  ✅ Auto-download: algorithm-comparison-1234567890.json
```

---

## 🌈 Color Palette

```
Header Background:    🟣 #667eea → 🟣 #764ba2 (Gradient)
A* Badge:             🔴 #ff6b6b
A* Background:        🔴 #ffe0e0
BFS Badge:            🔵 #4dabf7
BFS Background:       🔵 #e0f0ff
Greedy Badge:         🟢 #51cf66
Greedy Background:    🟢 #e0ffe0

Ranking:
  🥇 1st Place:       🟡 #ffd700 (Gold)
  🥈 2nd Place:       ⚪ #c0c0c0 (Silver)
  🥉 3rd Place:       🟠 #cd7f32 (Bronze)

Text:
  Primary:            ⚫ #333333
  Secondary:          ⚪ #999999
  Danger:             🔴 #dc3545
  Success:            🟢 #28a745
  Warning:            🟡 #ffc107
  Info:               🔵 #667eea

Background:
  Card:               ⚪ #ffffff
  Section:            ⚪ #f5f5f5
  Hover:              ⚪ #f9f9f9
```

---

## 📏 Layout Measurements

```
Header Height:           50px
Nav Link Padding:        8px 16px
Card Padding:            16px
Card Border Radius:      8px
Card Shadow:             0 2px 8px rgba(0,0,0,0.1)

Container:               Grid (60% map, 40% stats)
Map Min Height:          400px
Stats Section Height:    Flexible (scrollable)

Badge Size:              12px circle
Medal Badge:             24px circle

Metric Font Size:        16px (bold)
Label Font Size:         12px (uppercase)
Section Title:           14px (font-weight: 600)
```

---

## 🔄 State Management

```
Global Variables:
├── map (Leaflet map instance)
├── markers { A: null, B: null }
├── polylines { astar: null, bfs: null, greedy: null }
├── currentMetrics (null | object)
├── isLoading (boolean)
├── pointCount (number)
├── performanceChart (null | Chart instance)
└── COLORS, ALGORITHM_NAMES (constants)

Local Storage:
└── data (graph nodes from map.json)

Session Data (Metrics):
├── executionTime (ms)
├── pathLength (nodes)
├── pathDistance (units)
├── pathNodes (array of [id, lat, lon])
└── success (boolean)
```

---

## 📱 Responsive Breakpoints

```
Desktop (> 1024px):
├── Grid: 60% map | 40% stats
├── Stats section height: 600px
└── Full features enabled

Tablet (768px - 1024px):
├── Grid: 50% map | 50% stats
├── Stats section height: 500px
└── Some features may be hidden

Mobile (< 768px):
├── Grid: 100% (stacked)
├── Map: Full width
├── Stats: Below map (full width)
└── Recommend landscape mode
```

---

## ⚡ Performance Metrics

```
Page Load:              < 2 seconds
  ├── HTML Parse:       ~100ms
  ├── CSS Render:       ~150ms
  ├── JS Load:          ~300ms
  ├── Leaflet Init:     ~800ms
  └── Chart.js Load:    ~300ms

Algorithm Execution:    1-5ms
  ├── A*:               ~2-3ms
  ├── BFS:              ~2-4ms
  └── Greedy:           ~1-2ms

UI Updates:
  ├── Marker Update:    < 10ms
  ├── Polyline Draw:    < 100ms
  ├── Chart Render:     < 150ms
  └── Table Update:     < 50ms

Memory Usage:           ~5-10MB
  ├── Leaflet:          ~2MB
  ├── Chart.js:         ~1MB
  ├── Data (localStorage):  ~3-5MB
  └── Other:            ~1MB
```

---

**Giao diện hoàn toàn tương tác, chuyên nghiệp, và dễ sử dụng! 🎉**
