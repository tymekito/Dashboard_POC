// pathfinding.js - Dijkstra algorithm for robot path finding

class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift();
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}

export function findShortestPath(startPointId, endPointId, transitions) {
  if (startPointId === endPointId) {
    return [startPointId];
  }

  // Build adjacency list from transitions
  const graph = {};

  transitions.forEach((transition) => {
    if (!graph[transition.startSpotId]) {
      graph[transition.startSpotId] = [];
    }
    if (!graph[transition.endSpotId]) {
      graph[transition.endSpotId] = [];
    }

    // Assuming bidirectional connections
    graph[transition.startSpotId].push({
      node: transition.endSpotId,
      weight: 1, // All connections have equal weight
    });

    graph[transition.endSpotId].push({
      node: transition.startSpotId,
      weight: 1,
    });
  });

  // Dijkstra algorithm
  const distances = {};
  const previous = {};
  const queue = new PriorityQueue();

  // Initialize distances
  Object.keys(graph).forEach((nodeId) => {
    distances[nodeId] = nodeId === startPointId ? 0 : Infinity;
    previous[nodeId] = null;
    queue.enqueue(nodeId, distances[nodeId]);
  });

  while (!queue.isEmpty()) {
    const { element: currentNode } = queue.dequeue();

    if (currentNode === endPointId) {
      break;
    }

    if (!graph[currentNode]) continue;

    graph[currentNode].forEach((neighbor) => {
      const alt = distances[currentNode] + neighbor.weight;

      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = currentNode;
        queue.enqueue(neighbor.node, alt);
      }
    });
  }

  // Reconstruct path
  const path = [];
  let currentNode = endPointId;

  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = previous[currentNode];
  }

  // Return empty array if no path found
  return path[0] === startPointId ? path : [];
}

export function getRandomPointIds(mapPoints, count = 2) {
  if (mapPoints.length < 2) {
    return [];
  }

  const shuffled = [...mapPoints].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((point) => point.id);
}
