// Mock data dla mapy - punkty i przejścia
export const mockPoints = [
  { id: 1, x: 100, y: 100, label: "Point A" },
  { id: 2, x: 300, y: 150, label: "Point B" },
  { id: 3, x: 500, y: 100, label: "Point C" },
  { id: 4, x: 200, y: 300, label: "Point D" },
  { id: 5, x: 400, y: 350, label: "Point E" },
  { id: 6, x: 600, y: 300, label: "Point F" },
  { id: 7, x: 150, y: 500, label: "Point G" },
  { id: 8, x: 450, y: 550, label: "Point H" },
  { id: 9, x: 700, y: 450, label: "Point I" },
];

// Połączenia między punktami (przejścia)
export const mockConnections = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 6 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 4, to: 7 },
  { from: 5, to: 8 },
  { from: 6, to: 9 },
  { from: 7, to: 8 },
  { from: 8, to: 9 },
];

// Ścieżka ruchu robota
export const mockRobotPath = [1, 2, 5, 8, 9, 6, 3, 2, 1, 4, 7];
