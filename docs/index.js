// Khai báo các biến toàn cục
let ab = true; // Dùng để xác định lần click tiếp theo sẽ đặt điểm A hay B
let aid = -1; // ID của điểm A (node gần nhất)
let bid = -1; // ID của điểm B (node gần nhất)
let currentMap = "OpenStreetMap"; // Bản đồ hiện tại

// Tạo bản đồ và thiết lập vị trí mặc định
const mymap = L.map("mapid").setView([21.00269, 105.85159], 16);

// Khởi tạo 3 đường (Polyline) với màu sắc khác nhau cho 3 thuật toán
const lineB = L.polyline([], { color: "blue", weight: 3 }).addTo(mymap); // BFS
const lineG = L.polyline([], { color: "green", weight: 3 }).addTo(mymap); // Greedy
const lineA = L.polyline([], { color: "red", weight: 3 }).addTo(mymap); // A*

// Khởi tạo 2 marker (A và B) có thể kéo thả được
const a = L.marker([0, 0], { draggable: true }).addTo(mymap);
const b = L.marker([1, 1], { draggable: true }).addTo(mymap);

// Biến lưu trữ đường đi của từng thuật toán
let currentPathA = [];
let currentIndexA = 0;
let currentPathB = [];
let currentIndexB = 0;
let currentPathG = [];
let currentIndexG = 0;

// 🧭 Hàm vẽ đường đi từng bước (hiệu ứng động)
function renderPathPartially() {
  const offset = 0.0; // Độ lệch để tránh trùng đường

  // A*
  if (currentIndexA < currentPathA.length) {
    lineA.addLatLng(currentPathA[currentIndexA]);
    currentIndexA++;
    setTimeout(renderPathPartially, 200);
  }

  // BFS
  if (currentIndexB < currentPathB.length) {
    const latlngB = currentPathB[currentIndexB];
    const latlngBOffset = L.latLng(latlngB[0] + offset, latlngB[1] + offset);
    lineB.addLatLng(latlngBOffset);
    currentIndexB++;
    setTimeout(renderPathPartially, 200);
  }

  // Greedy
  if (currentIndexG < currentPathG.length) {
    const latlngG = currentPathG[currentIndexG];
    const latlngGOffset = L.latLng(latlngG[0] - offset, latlngG[1] - offset);
    lineG.addLatLng(latlngGOffset);
    currentIndexG++;
    setTimeout(renderPathPartially, 200);
  }
}

// 🧭 Hàm khởi động quá trình vẽ đường đi (cho cả 3 thuật toán)
function renderPathIncrementally(pathA, pathB, pathG) {
  currentPathA = pathA;
  currentIndexA = 0;
  currentPathB = pathB;
  currentIndexB = 0;
  currentPathG = pathG;
  currentIndexG = 0;
  renderPathPartially();
}

// 🎯 Sự kiện khi người dùng click chuột lên bản đồ
mymap.on("click", (e) => {
  // Tìm node gần nhất với vị trí click
  let nn = nearestNeighbour(e.latlng["lat"], e.latlng["lng"]);

  // Xác định xem đang đặt điểm A hay B
  if (ab) {
    a.setLatLng(nn);
    aid = nn.id;
    ab = false;
  } else {
    b.setLatLng(nn);
    bid = nn.id;
    ab = true;
  }

  // Nếu cả A và B đã được chọn thì bắt đầu vẽ đường đi
  if (aid > 0 && bid > 0) {
    // Xóa các đường cũ
    lineA.setLatLngs([]);
    lineB.setLatLngs([]);
    lineG.setLatLngs([]);

    // Gọi các thuật toán tìm đường
    let pathA = constructPath(astar(aid, bid), "Astar");
    let pathB = constructPath(bfs(aid, bid), "BFS");
    let pathG = constructPath(greedy(aid, bid), "Greedy");

    // Hiển thị đường đi theo từng bước
    renderPathIncrementally(pathA, pathB, pathG);

    // Reset lại ID sau khi hoàn thành
    aid = -1;
    bid = -1;
    ab = true;
  }
});

// 📍 Khi kéo thả marker A xong
a.on("dragend", (e) => {
  aid = null;
  let nn = nearestNeighbour(e.target.getLatLng().lat, e.target.getLatLng().lng);
  aid = nn.id;

  // Cập nhật lại đường đi giữa A và B
  let pathA = constructPath(astar(aid, bid), "Astar");
  let pathB = constructPath(bfs(aid, bid), "BFS");
  let pathG = constructPath(greedy(aid, bid), "Greedy");
  lineA.setLatLngs(pathA);
  lineB.setLatLngs(pathB);
  lineG.setLatLngs(pathG);
});

// 📍 Khi kéo thả marker B xong
b.on("dragend", (e) => {
  bid = null;
  let nn = nearestNeighbour(e.target.getLatLng().lat, e.target.getLatLng().lng);
  bid = nn.id;

  // Cập nhật lại đường đi giữa A và B
  let pathA = constructPath(astar(aid, bid), "Astar");
  let pathB = constructPath(bfs(aid, bid), "BFS");
  let pathG = constructPath(greedy(aid, bid), "Greedy");
  lineA.setLatLngs(pathA);
  lineB.setLatLngs(pathB);
  lineG.setLatLngs(pathG);
});

// 🌍 Các lớp bản đồ nền
const baseMaps = {
  OpenStreetMap: L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 20,
    }
  ),
  "Google Satellite": L.tileLayer(
    "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  ),
};

// Hiển thị thước đo tỉ lệ
var scale = L.control.scale();
scale.addTo(mymap);

// Thêm bản đồ nền mặc định (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
}).addTo(mymap);

const overlayMaps = {};

// 📁 Đọc dữ liệu node từ file map.json
fetch("map.json")
  .then((response) => response.json())
  .then((data) => {
    // Lưu dữ liệu node vào localStorage
    localStorage.setItem("data", JSON.stringify(data.nodes));

    // Đếm số node trong bản đồ
    let l = 0;
    for (let k in data.nodes) l++;

    // Tạo các vòng tròn nhỏ biểu thị node
    let circles = [];
    for (let key in data.nodes) {
      if (data.nodes.hasOwnProperty(key)) {
        circles.push(
          L.circle([data.nodes[key].lat, data.nodes[key].lon], { radius: 1 })
        );
      }
    }

    // Gộp tất cả node thành một lớp (layer)
    let circlesLayer = L.layerGroup(circles);

    // Thêm vào layer control
    overlayMaps[`${l} Nodes`] = circlesLayer;
    L.control.layers(baseMaps, overlayMaps).addTo(mymap);
  });

// 🔄 Khởi tạo sẵn layer node nếu dữ liệu đã có trong localStorage
(() => {
  let data = JSON.parse(localStorage.getItem("data"));
  let circles = [];
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      circles.push(L.circle([data[key].lat, data[key].lon], { radius: 1 }));
    }
  }
  let circlesLayer = L.layerGroup(circles);
})();
