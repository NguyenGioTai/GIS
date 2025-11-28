/**
 * Thuật toán Greedy Best-First Search
 * → Chỉ sử dụng heuristic (khoảng cách ước lượng đến đích) để chọn nút tiếp theo
 * → **Không đảm bảo đường đi ngắn nhất**, có thể rơi vào bẫy cục bộ
 *
 * @param {number|string} startId - ID nút bắt đầu
 * @param {number|string} goalId  - ID nút đích
 * @returns {object|null} - Nút đích nếu tìm thấy, null nếu không có đường
 */
function greedy(startId, goalId) {
  console.time("Greedy Runtime");
  // Lấy dữ liệu đồ thị từ localStorage
  let data = JSON.parse(localStorage.getItem("data"));

  // Hàng đợi ưu tiên: sắp xếp theo heuristic (h) - càng gần đích càng ưu tiên
  let queue = [
    {
      id: startId,
      cost: manhattan(
        // cost = h (heuristic) - tại start, g = 0
        data[startId].lat,
        data[startId].lon,
        data[goalId].lat,
        data[goalId].lon
      ),
      path: 0, // Chi phí thực tế từ start đến nút hiện tại (g) - **không dùng để sắp xếp**
      parent: null,
      lat: data[startId].lat,
      lon: data[startId].lon,
    },
  ];

  // Tập hợp các nút đã thăm
  let visited = new Set();

  // Đếm vòng lặp để tránh treo khi bị kẹt
  let iterations = 0;

  // Vòng lặp chính
  while (true) {
    ++iterations;

    // Nếu hàng đợi rỗng → không tìm thấy đường
    if (queue.length === 0) {
      return null;
    }

    // Lấy nút có heuristic nhỏ nhất (gần đích nhất)
    let current = queue.shift();

    // Tìm thấy đích → trả về
    if (current.id == goalId) {
      console.timeEnd("Greedy Runtime");
      return current;
    }

    // Đánh dấu đã thăm
    visited.add(current.id);

    // Lấy các nút con
    let children = getChildrenGreedy(current, goalId, data);

    // Cờ kiểm tra có thêm nút mới vào hàng đợi không
    let changedQueue = false;

    // Thêm các con chưa thăm vào hàng đợi
    for (let child of children) {
      if (!visited.has(child.id)) {
        queue.push(child);
        changedQueue = true;
      }
    }

    // Nếu còn nút để xét
    if (queue.length > 0) {
      // Tránh vòng lặp vô hạn khi không có tiến triển (sau 50 lần không thêm nút mới)
      if (!changedQueue && iterations > 50) continue;

      // Sắp xếp theo heuristic (h) tăng dần → ưu tiên nút gần đích nhất
      queue.sort((a, b) => {
        if (a.cost < b.cost) return -1;
        if (a.cost > b.cost) return 1;
        return 0;
      });
    } else {
      return null; // Không còn đường nào
    }
  }
}

/**
 * Tạo danh sách nút con với chi phí = heuristic (manhattan đến đích)
 *
 * @param {object} parent  - Nút cha
 * @param {number|string} goalId - ID đích
 * @param {object} data    - Dữ liệu đồ thị
 * @returns {array} - Mảng các nút con
 */
function getChildrenGreedy(parent, goalId, data) {
  let children = [];

  // Duyệt qua các nút kề
  for (let c of data[parent.id].con) {
    // Heuristic: khoảng cách Manhattan từ nút con đến đích
    let heuristic = manhattan(
      data[c].lat,
      data[c].lon,
      data[goalId].lat,
      data[goalId].lon
    );

    children.push({
      id: c,
      lat: data[c].lat,
      lon: data[c].lon,
      parent: parent,
      cost: heuristic, // cost = h(n) → dùng để sắp xếp
      path: heuristic, // (giữ lại để debug, không dùng trong sắp xếp)
    });
  }

  return children;
}
