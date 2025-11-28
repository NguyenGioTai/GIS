/**
 * Thuật toán BFS (Breadth-First Search) tìm đường ngắn nhất theo số cạnh
 * (đảm bảo đường đi có số bước ít nhất khi đồ thị không có trọng số)
 *
 * @param {number|string} startId - ID của nút bắt đầu
 * @param {number|string} goalId  - ID của nút đích
 * @returns {object|null} - Trả về nút đích nếu tìm thấy, null nếu không có đường
 */
function bfs(startId, goalId) {
  console.time("BFS Runtime");
  // Lấy dữ liệu đồ thị từ localStorage
  let data = JSON.parse(localStorage.getItem("data"));

  // Hàng đợi FIFO: chứa các nút cần xét
  // Mỗi phần tử gồm: id, path (độ dài đường đi hiện tại), parent, lat, lon
  let queue = [
    {
      id: startId,
      path: 0, // Độ dài đường đi từ start đến nút hiện tại (theo số cạnh)
      parent: null, // Con trỏ ngược để truy vết đường đi
      lat: data[startId].lat,
      lon: data[startId].lon,
    },
  ];

  // Tập hợp các nút đã được thăm (để tránh lặp)
  let visited = new Set();

  // Vòng lặp chính của BFS
  while (true) {
    // Nếu hàng đợi rỗng → không có đường đi
    if (queue.length === 0) {
      return null;
    }

    // Lấy nút đầu tiên trong hàng đợi (FIFO)
    let current = queue.shift();

    // Kiểm tra nếu đã đến đích
    if (current.id == goalId) {
      console.timeEnd("BFS Runtime");
      return current; // Trả về nút đích → có thể truy ngược parent để lấy toàn bộ đường đi
    }

    // Đánh dấu nút hiện tại đã được thăm
    visited.add(current.id);

    // Lấy danh sách các nút con (kề) của nút hiện tại
    let children = getChildrenBfs(current, data);

    // Duyệt qua từng nút con
    for (let child of children) {
      // Chỉ thêm vào hàng đợi nếu chưa được thăm
      if (!visited.has(child.id)) {
        queue.push(child);
      }
    }
  }
}

/**
 * Tạo danh sách các nút con (neighbors) từ một nút cha
 *
 * @param {object} parent - Nút cha hiện tại
 * @param {object} data   - Dữ liệu đồ thị
 * @returns {array} - Mảng các nút con có id, lat, lon, parent
 */
function getChildrenBfs(parent, data) {
  let children = [];

  // Duyệt qua tất cả các ID kết nối trong data[parent.id].con
  for (let c of data[parent.id].con) {
    children.push({
      id: c,
      lat: data[c].lat,
      lon: data[c].lon,
      parent: parent, // Lưu parent để truy vết đường đi
      path: parent.path + 1, // Tăng độ dài đường đi thêm 1 bước
    });
  }

  return children;
}
