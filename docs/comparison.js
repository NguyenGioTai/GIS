/**
 * Main comparison interface module
 * Handles map interaction, algorithm execution, and UI updates
 */

let map;
let markers = { A: null, B: null };
let polylines = { astar: null, bfs: null, greedy: null };
let currentMetrics = null;
let isLoading = false;
let pointCount = 0;
let layers = {};

// Color mapping for algorithms
const COLORS = {
  astar: "#ff6b6b",
  bfs: "#4dabf7",
  greedy: "#51cf66",
};

const ALGORITHM_NAMES = {
  astar: "A*",
  bfs: "BFS",
  greedy: "Greedy",
};

/**
 * Initialize map and event listeners
 */
function initMap() {
  map = L.map("mapid").setView([21.00269, 105.85159], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  // Layer control
  const layers = {
    OpenStreetMap: L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }
    ),
    Satellite: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenTopoMap contributors",
      maxZoom: 17,
    }),
  };

  L.control.layers(layers).addTo(map);
  layers["OpenStreetMap"].addTo(map);

  // Add nodes layer
  addNodesLayer();

  // Map click handler
  map.on("click", onMapClick);
}

/**
 * Add layer showing all nodes as circles
 */
function addNodesLayer() {
  const data = JSON.parse(localStorage.getItem("data"));
  if (!data) return;

  const circles = [];
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      circles.push(
        L.circle([data[key].lat, data[key].lon], {
          radius: 3,
          color: "#4dabf7",
          fill: true,
          fillColor: "#4dabf7",
          fillOpacity: 0.6,
          weight: 1,
          opacity: 0.7,
        })
      );
    }
  }

  const nodesLayer = L.layerGroup(circles);
  const overlayMaps = {};
  overlayMaps[`${circles.length} Nodes`] = nodesLayer;

  // Add to layer control and turn on by default
  L.control.layers(layers, overlayMaps).addTo(map);
  nodesLayer.addTo(map);
}

/**
 * Handle map click to select points
 */
function onMapClick(e) {
  if (isLoading) return;

  const latlng = e.latlng;
  const point = pointCount % 2 === 0 ? "A" : "B";

  // Remove previous marker if exists
  if (markers[point]) {
    map.removeLayer(markers[point]);
  }

  // Create new marker
  const markerColor = point === "A" ? "red" : "blue";
  const markerIcon = L.icon({
    iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(
      markerColor
    )}'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12c0 4.08 2.88 7.5 6.71 8.47.6.1.89-.26.89-.58v-2.05c-2.76.6-3.36-1.34-3.36-1.34-.54-1.37-1.32-1.73-1.32-1.73-1.08-.74.08-.72.08-.72 1.19.08 1.82 1.22 1.82 1.22 1.06 1.82 2.79 1.29 3.47.99.1-.78.41-1.29.75-1.58-2.67-.3-5.48-1.33-5.48-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02 0 2.04.14 3 .41 2.26-1.55 3.28-1.23 3.28-1.23.65 1.65.24 2.88.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.29.69.89.58C19.12 19.5 22 16.08 22 12c0-5.52-4.48-10-10-10z'/%3E%3C/svg%3E`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const marker = L.marker([latlng.lat, latlng.lng], {
    icon: markerIcon,
    draggable: true,
  })
    .bindPopup(
      `Điểm ${point} [${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}]`
    )
    .addTo(map);

  marker.on("dragend", onMarkerDragEnd);
  markers[point] = marker;
  pointCount++;

  updatePointDisplay();

  // If both points selected, run comparison
  if (markers.A && markers.B) {
    runComparison();
  }
}

/**
 * Handle marker drag
 */
function onMarkerDragEnd(e) {
  if (isLoading) return;

  updatePointDisplay();
  runComparison();
}

/**
 * Update point display in stats
 */
function updatePointDisplay() {
  if (markers.A) {
    const latA = markers.A.getLatLng().lat.toFixed(5);
    const lngA = markers.A.getLatLng().lng.toFixed(5);
    document.getElementById("start-point").textContent = `[${latA}, ${lngA}]`;
  }

  if (markers.B) {
    const latB = markers.B.getLatLng().lat.toFixed(5);
    const lngB = markers.B.getLatLng().lng.toFixed(5);
    document.getElementById("end-point").textContent = `[${latB}, ${lngB}]`;
  }
}

/**
 * Run all algorithms and update display
 */
async function runComparison() {
  if (!markers.A || !markers.B || isLoading) {
    return;
  }

  isLoading = true;
  showLoading();

  try {
    const posA = markers.A.getLatLng();
    const posB = markers.B.getLatLng();

    // Find nearest nodes
    const startNode = nearestNeighbour(posA.lat, posA.lng);
    const endNode = nearestNeighbour(posB.lat, posB.lng);

    // Run all algorithms
    const metrics = runAllAlgorithmsWithMetrics(startNode.id, endNode.id);
    currentMetrics = metrics;

    // Clear previous polylines
    clearPolylines();

    // Display results
    displayPaths(metrics, startNode, endNode);
    displayComparison(metrics);
  } catch (error) {
    console.error("Lỗi khi chạy so sánh:", error);
    showError("Có lỗi xảy ra khi chạy thuật toán");
  } finally {
    isLoading = false;
  }
}

/**
 * Display paths on map
 */
function displayPaths(metrics, startNode, endNode) {
  // A* path (red)
  if (metrics.astar.success && metrics.astar.pathNodes.length > 0) {
    const path = metrics.astar.pathNodes.map((p) => [p[1], p[2]]);
    polylines.astar = L.polyline(path, {
      color: COLORS.astar,
      weight: 3,
      opacity: 0.8,
      dashArray: "5, 5",
      lineCap: "round",
    }).addTo(map);
  }

  // BFS path (blue)
  if (metrics.bfs.success && metrics.bfs.pathNodes.length > 0) {
    const path = metrics.bfs.pathNodes.map((p) => [p[1], p[2]]);
    polylines.bfs = L.polyline(path, {
      color: COLORS.bfs,
      weight: 3,
      opacity: 0.8,
      dashArray: "10, 5",
      lineCap: "round",
    }).addTo(map);
  }

  // Greedy path (green)
  if (metrics.greedy.success && metrics.greedy.pathNodes.length > 0) {
    const path = metrics.greedy.pathNodes.map((p) => [p[1], p[2]]);
    polylines.greedy = L.polyline(path, {
      color: COLORS.greedy,
      weight: 3,
      opacity: 0.8,
      dashArray: "2, 5",
      lineCap: "round",
    }).addTo(map);
  }

  // Fit map to bounds
  if (polylines.astar) {
    map.fitBounds(polylines.astar.getBounds().pad(0.1));
  }
}

/**
 * Display comparison results in stats
 */
function displayComparison(metrics) {
  const resultsDiv = document.getElementById("comparison-results");
  let html = "";

  // Display each algorithm's result
  const algorithms = ["astar", "bfs", "greedy"];
  const rankings = compareMetrics(metrics);

  algorithms.forEach((algo) => {
    const metric = metrics[algo];
    const timeRank = rankings.time.find(
      (r) => r.name === metric.algorithmName
    ).rank;
    const distRank = rankings.distance.find(
      (r) => r.name === metric.algorithmName
    ).rank;

    html += `
            <div class="algorithm-result ${algo}">
                <div style="flex: 1; display: flex; align-items: center; gap: 12px;">
                    <span class="algo-badge badge-${algo}"></span>
                    <span class="algo-name">${ALGORITHM_NAMES[algo]}</span>
                    ${
                      metric.success
                        ? `<span style="color: #28a745; font-size: 12px;">✓ Thành công</span>`
                        : `<span style="color: #dc3545; font-size: 12px;">✗ Thất bại</span>`
                    }
                </div>

                <div class="metric">
                    <div class="metric-label">⏱️ Thời gian</div>
                    <div class="metric-value">${parseFloat(
                      metric.executionTime
                    ).toFixed(2)}<span class="metric-unit">ms</span></div>
                </div>

                <div class="metric">
                    <div class="metric-label">📏 Quãng đường</div>
                    <div class="metric-value">${parseFloat(
                      metric.pathDistance
                    ).toFixed(4)}</div>
                </div>

                <div class="metric">
                    <div class="metric-label">🔗 Số nút</div>
                    <div class="metric-value">${metric.pathLength}</div>
                </div>

                <div style="margin-left: auto; text-align: right;">
                    <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Thứ hạng</div>
                    <div style="display: flex; gap: 8px;">
                        <span class="rank-badge rank-${timeRank}">⏱️ ${timeRank}</span>
                        <span class="rank-badge rank-${distRank}">📏 ${distRank}</span>
                    </div>
                </div>
            </div>
        `;
  });

  resultsDiv.innerHTML = html;

  // Update summary table
  updateSummaryTable(metrics, rankings);

  // Update chart
  updatePerformanceChart(metrics);
}

/**
 * Update summary table
 */
function updateSummaryTable(metrics, rankings) {
  const tbody = document.getElementById("summary-tbody");
  let html = "";

  const algorithms = ["astar", "bfs", "greedy"];
  algorithms.forEach((algo) => {
    const metric = metrics[algo];
    const timeRank = rankings.time.find(
      (r) => r.name === metric.algorithmName
    ).rank;
    const distRank = rankings.distance.find(
      (r) => r.name === metric.algorithmName
    ).rank;
    const lengthRank = rankings.length.find(
      (r) => r.name === metric.algorithmName
    ).rank;

    html += `
            <tr>
                <td><span class="algo-badge badge-${algo}"></span> ${
      ALGORITHM_NAMES[algo]
    }</td>
                <td>
                    <span class="rank-badge rank-${timeRank}">${timeRank}</span>
                    ${parseFloat(metric.executionTime).toFixed(2)} ms
                </td>
                <td>
                    <span class="rank-badge rank-${distRank}">${distRank}</span>
                    ${parseFloat(metric.pathDistance).toFixed(4)}
                </td>
                <td>
                    <span class="rank-badge rank-${lengthRank}">${lengthRank}</span>
                    ${metric.pathLength}
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;

  // Show best performance message
  const bestTime = rankings.time[0];
  console.log(
    `Thuật toán nhanh nhất: ${bestTime.name} - ${bestTime.value.toFixed(2)} ms`
  );
}

/**
 * Update performance chart
 */
let performanceChart = null;

function updatePerformanceChart(metrics) {
  const ctx = document.getElementById("performanceChart").getContext("2d");

  const algorithms = ["astar", "bfs", "greedy"];
  const labels = algorithms.map((a) => ALGORITHM_NAMES[a]);
  const times = algorithms.map((a) => parseFloat(metrics[a].executionTime));
  const distances = algorithms.map((a) => parseFloat(metrics[a].pathDistance));

  // Normalize distances for comparison on same scale
  const maxDistance = Math.max(...distances);
  const normalizedDistances = distances.map(
    (d) => (d / maxDistance) * Math.max(...times)
  );

  if (performanceChart) {
    performanceChart.destroy();
  }

  performanceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Thời gian (ms)",
          data: times,
          backgroundColor: algorithms.map((a) => COLORS[a]),
          borderColor: algorithms.map((a) => COLORS[a]),
          borderWidth: 2,
          borderRadius: 4,
          yAxisID: "y",
        },
        {
          label: "Quãng đường (normalized)",
          data: normalizedDistances,
          backgroundColor: algorithms.map((a) => hexToRgba(COLORS[a], 0.3)),
          borderColor: algorithms.map((a) => COLORS[a]),
          borderWidth: 1,
          borderDash: [5, 5],
          borderRadius: 4,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: { size: 12 },
            padding: 12,
            usePointStyle: true,
          },
        },
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Thời gian (ms)",
            font: { size: 12 },
          },
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Quãng đường (chuẩn hóa)",
            font: { size: 12 },
          },
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    },
  });
}

/**
 * Utility: Convert hex to rgba
 */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Clear all polylines
 */
function clearPolylines() {
  Object.values(polylines).forEach((line) => {
    if (line) {
      map.removeLayer(line);
    }
  });
  polylines = { astar: null, bfs: null, greedy: null };
}

/**
 * Show loading state
 */
function showLoading() {
  const resultsDiv = document.getElementById("comparison-results");
  resultsDiv.innerHTML = `
        <div class="loading">
            <span class="spinner"></span>
            Đang chạy thuật toán...
        </div>
    `;
}

/**
 * Show error message
 */
function showError(message) {
  const resultsDiv = document.getElementById("comparison-results");
  resultsDiv.innerHTML = `
        <div class="no-data">
            ⚠️ ${message}
        </div>
    `;
}

/**
 * Reset comparison
 */
function resetComparison() {
  // Clear markers
  if (markers.A) map.removeLayer(markers.A);
  if (markers.B) map.removeLayer(markers.B);
  markers = { A: null, B: null };
  pointCount = 0;

  // Clear polylines
  clearPolylines();

  // Reset UI
  document.getElementById("start-point").textContent = "Chưa chọn";
  document.getElementById("end-point").textContent = "Chưa chọn";
  document.getElementById("comparison-results").innerHTML = `
        <div class="empty-state">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="50" cy="50" r="40" />
                <path d="M 30 50 H 70 M 50 30 V 70" />
            </svg>
            <p>Chọn điểm A và B trên bản đồ để bắt đầu so sánh</p>
        </div>
    `;

  if (performanceChart) {
    performanceChart.destroy();
    performanceChart = null;
  }

  document.getElementById("summary-tbody").innerHTML = `
        <tr>
            <td colspan="4" style="text-align: center; color: #999;">Dữ liệu chưa có</td>
        </tr>
    `;

  // Reset map view
  map.setView([21.00269, 105.85159], 14);

  currentMetrics = null;
}

/**
 * Export results as JSON
 */
function exportResults() {
  if (!currentMetrics) {
    alert("Không có dữ liệu để xuất");
    return;
  }

  const exportData = {
    timestamp: new Date().toISOString(),
    startPoint: {
      lat: markers.A.getLatLng().lat,
      lng: markers.A.getLatLng().lng,
    },
    endPoint: {
      lat: markers.B.getLatLng().lat,
      lng: markers.B.getLatLng().lng,
    },
    algorithms: {
      astar: currentMetrics.astar.toObject(),
      bfs: currentMetrics.bfs.toObject(),
      greedy: currentMetrics.greedy.toObject(),
    },
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `algorithm-comparison-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Load map data from map.json
 */
function loadMapData() {
  return fetch("./map.json")
    .then((response) => {
      if (!response.ok)
        throw new Error(`Failed to load map.json: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("data", JSON.stringify(data.nodes));
      console.log(
        "✅ Map data loaded successfully:",
        Object.keys(data.nodes).length,
        "nodes"
      );
      return data;
    })
    .catch((error) => {
      console.error("❌ Error loading map.json:", error);
      showError("Không thể tải dữ liệu bản đồ. Vui lòng refresh trang.");
      throw error;
    });
}

/**
 * Initialize on page load
 */
document.addEventListener("DOMContentLoaded", () => {
  // Load map data first, then initialize
  loadMapData()
    .then(() => {
      initMap();
      console.log("✅ Comparison interface initialized");
    })
    .catch((error) => {
      console.error("Failed to initialize:", error);
    });
});
