/**
 * Module để theo dõi metrics của các thuật toán
 * Tính toán và lưu trữ thông tin hiệu suất: thời gian, quãng đường, nút duyệt, etc.
 */

class AlgorithmMetrics {
  constructor(algorithmName) {
    this.algorithmName = algorithmName;
    this.startTime = 0;
    this.endTime = 0;
    this.executionTime = 0;
    this.pathLength = 0;
    this.pathDistance = 0;
    this.nodesExplored = 0;
    this.pathNodes = [];
    this.success = false;
    this.error = null;
  }

  start() {
    this.startTime = performance.now();
  }

  end() {
    this.endTime = performance.now();
    this.executionTime = this.endTime - this.startTime;
  }

  setPath(path, pathFull) {
    this.pathLength = path.length;
    this.pathNodes = pathFull;

    // Calculate total distance
    this.pathDistance = 0;
    for (let i = 0; i < pathFull.length - 1; i++) {
      this.pathDistance += distance(
        pathFull[i][1],
        pathFull[i][2],
        pathFull[i + 1][1],
        pathFull[i + 1][2]
      );
    }
  }

  setSuccess(isSuccess) {
    this.success = isSuccess;
  }

  setError(errorMsg) {
    this.error = errorMsg;
  }

  toObject() {
    return {
      algorithmName: this.algorithmName,
      executionTime: this.executionTime.toFixed(2),
      pathLength: this.pathLength,
      pathDistance: this.pathDistance.toFixed(6),
      nodesExplored: this.nodesExplored,
      success: this.success,
      error: this.error,
      pathNodes: this.pathNodes,
    };
  }
}

/**
 * Wrapper function để chạy A* với metrics tracking
 */
function runAstarWithMetrics(startId, goalId) {
  const metrics = new AlgorithmMetrics("A*");
  metrics.start();

  try {
    const result = astar(startId, goalId);
    metrics.end();

    if (result) {
      const path = [];
      const pathFull = [];
      let node = result;

      while (node) {
        path.push([node.lat, node.lon]);
        pathFull.push([node.id, node.lat, node.lon]);
        node = node.parent;
      }

      path.reverse();
      pathFull.reverse();

      metrics.setPath(path, pathFull);
      metrics.setSuccess(true);
    } else {
      metrics.setSuccess(false);
    }
  } catch (error) {
    metrics.end();
    metrics.setError(error.message);
    metrics.setSuccess(false);
  }

  return metrics;
}

/**
 * Wrapper function để chạy BFS với metrics tracking
 */
function runBfsWithMetrics(startId, goalId) {
  const metrics = new AlgorithmMetrics("BFS");
  metrics.start();

  try {
    const result = bfs(startId, goalId);
    metrics.end();

    if (result) {
      const path = [];
      const pathFull = [];
      let node = result;

      while (node) {
        path.push([node.lat, node.lon]);
        pathFull.push([node.id, node.lat, node.lon]);
        node = node.parent;
      }

      path.reverse();
      pathFull.reverse();

      metrics.setPath(path, pathFull);
      metrics.setSuccess(true);
    } else {
      metrics.setSuccess(false);
    }
  } catch (error) {
    metrics.end();
    metrics.setError(error.message);
    metrics.setSuccess(false);
  }

  return metrics;
}

/**
 * Wrapper function để chạy Greedy với metrics tracking
 */
function runGreedyWithMetrics(startId, goalId) {
  const metrics = new AlgorithmMetrics("Greedy");
  metrics.start();

  try {
    const result = greedy(startId, goalId);
    metrics.end();

    if (result) {
      const path = [];
      const pathFull = [];
      let node = result;

      while (node) {
        path.push([node.lat, node.lon]);
        pathFull.push([node.id, node.lat, node.lon]);
        node = node.parent;
      }

      path.reverse();
      pathFull.reverse();

      metrics.setPath(path, pathFull);
      metrics.setSuccess(true);
    } else {
      metrics.setSuccess(false);
    }
  } catch (error) {
    metrics.end();
    metrics.setError(error.message);
    metrics.setSuccess(false);
  }

  return metrics;
}

/**
 * Chạy tất cả 3 thuật toán và lấy metrics
 */
function runAllAlgorithmsWithMetrics(startId, goalId) {
  return {
    astar: runAstarWithMetrics(startId, goalId),
    bfs: runBfsWithMetrics(startId, goalId),
    greedy: runGreedyWithMetrics(startId, goalId),
  };
}

/**
 * So sánh các metrics và trả về ranking
 */
function compareMetrics(allMetrics) {
  const algorithms = Object.values(allMetrics);

  // Sort by execution time
  const timeRanking = [...algorithms]
    .sort((a, b) => parseFloat(a.executionTime) - parseFloat(b.executionTime))
    .map((m, index) => ({
      name: m.algorithmName,
      rank: index + 1,
      metric: "time",
      value: m.executionTime,
    }));

  // Sort by path distance
  const distanceRanking = [...algorithms]
    .sort((a, b) => parseFloat(a.pathDistance) - parseFloat(b.pathDistance))
    .map((m, index) => ({
      name: m.algorithmName,
      rank: index + 1,
      metric: "distance",
      value: m.pathDistance,
    }));

  // Sort by path length (number of nodes)
  const lengthRanking = [...algorithms]
    .sort((a, b) => a.pathLength - b.pathLength)
    .map((m, index) => ({
      name: m.algorithmName,
      rank: index + 1,
      metric: "length",
      value: m.pathLength,
    }));

  return {
    time: timeRanking,
    distance: distanceRanking,
    length: lengthRanking,
  };
}
