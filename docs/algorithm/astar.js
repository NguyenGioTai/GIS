/**
 * Thuật toán A* (A-star) để tìm đường đi ngắn nhất từ startId đến goalId
 * Sử dụng heuristic là khoảng cách Manhattan
 *
 * @param {number|string} startId - ID của nút bắt đầu
 * @param {number|string} goalId  - ID của nút đích
 * @returns {object|null} - Trả về nút đích nếu tìm thấy đường đi, null nếu không
 */
function astar(startId, goalId) {
  console.time("A* Runtime");
  // Lấy dữ liệu đồ thị từ localStorage (dạng JSON)
  let data = JSON.parse(localStorage.getItem("data"));

  // Hàng đợi ưu tiên (priority queue) chứa các nút cần xét
  // Mỗi phần tử có: id, cost (f = g + h), path (g - chi phí thực tế), heuristic (h), parent, lat, lon
  let queue = [
    {
      id: startId,
      cost: manhattan(
        // f = g + h, tại nút đầu g = 0 nên cost = h
        data[startId].lat,
        data[startId].lon,
        data[goalId].lat,
        data[goalId].lon
      ),
      path: 0, // Chi phí thực tế từ start đến nút hiện tại (g)
      parent: null,
      lat: data[startId].lat,
      lon: data[startId].lon,
      heuristic: 0, // h = 0 ban đầu (sẽ được tính lại sau)
    },
  ];

  // Tập hợp các nút đã được thăm (đã mở rộng)
  let visited = new Set();

  // Mảng lưu thông tin tất cả các nút đã được xử lý (dùng để debug/visualize)
  let nodesArray = [];

  // Đếm số vòng lặp (phòng trường hợp vòng lặp vô hạn hoặc hiệu suất kém)
  let iterations = 0;

  // Vòng lặp chính của A*
  while (true) {
    ++iterations;

    // Lấy nút có chi phí nhỏ nhất (f = g + h) từ hàng đợi
    let current = queue.shift();

    // Lưu thông tin nút hiện tại vào mảng để theo dõi quá trình tìm kiếm
    nodesArray.push({
      id: current.id,
      lat: current.lat,
      lon: current.lon,
      cost: current.cost, // f-score
      path: current.path, // g-score
      heuristic: manhattan(
        // Tính lại heuristic để đảm bảo chính xác
        current.lat,
        current.lon,
        data[goalId].lat,
        data[goalId].lon
      ),
    });

    // Kiểm tra nếu đã đến nút đích
    if (current.id == goalId) {
      console.timeEnd("A* Runtime");
      return current; // Trả về nút đích (có thể truy ngược parent để lấy đường đi)
    } else {
      // Đánh dấu nút hiện tại đã được thăm
      visited.add(current.id);

      // Lấy tất cả các nút kề (con) của nút hiện tại
      let children = getChildrenAstar(current, goalId, data);

      // Cờ kiểm tra xem có thêm nút mới vào hàng đợi không
      let changedQueue = false;

      // Lưu danh sách con vào mảng theo dõi (dùng để visualize cây tìm kiếm)
      nodesArray.push(children);

      // Duyệt qua từng nút con
      for (let child of children) {
        // Chỉ thêm vào hàng đợi nếu chưa được thăm
        if (!visited.has(child.id)) {
          queue.push(child);
          changedQueue = true; // Đánh dấu có thay đổi trong hàng đợi
        }
      }

      // Nếu hàng đợi còn phần tử
      if (queue.length > 0) {
        // Tránh vòng lặp vô hạn khi không có tiến triển (sau 50 lần lặp không thêm nút mới)
        if (!changedQueue && iterations > 50) continue;

        // Sắp xếp hàng đợi theo chi phí tổng (f = g + h) tăng dần
        // → Đảm bảo luôn lấy nút tốt nhất tiếp theo
        queue.sort((a, b) => {
          if (a.cost < b.cost) return -1;
          if (a.cost > b.cost) return 1;
          return 0;
        });
      } else {
        // Không còn nút nào để xét → không tìm thấy đường
        return null;
      }
    }
  }
}

/**
 * Lấy danh sách các nút con (neighbors) từ nút cha
 * Tính toán g, h, f cho từng nút con
 *
 * @param {object} parent - Nút cha hiện tại
 * @param {number|string} goalId - ID nút đích
 * @param {object} data - Dữ liệu đồ thị
 * @returns {array} - Mảng các nút con với đầy đủ thông tin chi phí
 */
function getChildrenAstar(parent, goalId, data) {
  let children = [];

  // Duyệt qua tất cả các nút kề trong danh sách kết nối (con)
  for (let c of data[parent.id].con) {
    // Tính chi phí thực tế từ start đến nút con (g)
    let path =
      parent.path + distance(parent.lat, parent.lon, data[c].lat, data[c].lon);

    // Tính heuristic (ước lượng từ nút con đến đích) bằng Manhattan
    let heuristic = manhattan(
      data[c].lat,
      data[c].lon,
      data[goalId].lat,
      data[goalId].lon
    );

    // Tổng chi phí f = g + h
    let totalCost = path + heuristic;

    // Thêm nút con vào danh sách
    children.push({
      id: c,
      lat: data[c].lat,
      lon: data[c].lon,
      parent: parent, // Con trỏ ngược để truy vết đường đi
      cost: totalCost, // f-score
      path: path, // g-score
      heuristic: heuristic, // h-score
    });
  }

  return children;
}
