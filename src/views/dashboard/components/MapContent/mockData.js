// mockData.js - Grid of points with resolution 0.05, origin (0,0)

export const mockData = {
  points: [
    // Row 1 (y = 0)
    { id: 0, name: "A1", x: 0, y: 0 },
    { id: 1, name: "A2", x: 0.05, y: 0 },
    { id: 2, name: "A3", x: 0.1, y: 0 },
    { id: 3, name: "A4", x: 0.15, y: 0 },
    { id: 4, name: "A5", x: 0.2, y: 0 },

    // Row 2 (y = 0.05)
    { id: 5, name: "B1", x: 0, y: 0.05 },
    { id: 6, name: "B2", x: 0.05, y: 0.05 },
    { id: 7, name: "B3", x: 0.1, y: 0.05 },
    { id: 8, name: "B4", x: 0.15, y: 0.05 },
    { id: 9, name: "B5", x: 0.2, y: 0.05 },

    // Row 3 (y = 0.10)
    { id: 10, name: "C1", x: 0, y: 0.1 },
    { id: 11, name: "C2", x: 0.05, y: 0.1 },
    { id: 12, name: "C3", x: 0.1, y: 0.1 },
    { id: 13, name: "C4", x: 0.15, y: 0.1 },
    { id: 14, name: "C5", x: 0.2, y: 0.1 },

    // Row 4 (y = 0.15)
    { id: 15, name: "D1", x: 0, y: 0.15 },
    { id: 16, name: "D2", x: 0.05, y: 0.15 },
    { id: 17, name: "D3", x: 0.1, y: 0.15 },
    { id: 18, name: "D4", x: 0.15, y: 0.15 },
    { id: 19, name: "D5", x: 0.2, y: 0.15 },

    // Row 5 (y = 0.20)
    { id: 20, name: "E1", x: 0, y: 0.2 },
    { id: 21, name: "E2", x: 0.05, y: 0.2 },
    { id: 22, name: "E3", x: 0.1, y: 0.2 },
    { id: 23, name: "E4", x: 0.15, y: 0.2 },
    { id: 24, name: "E5", x: 0.2, y: 0.2 },
  ],

  connections: [
    // Horizontal connections (left to right)
    // Row 1
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },

    // Row 2
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 7, to: 8 },
    { from: 8, to: 9 },

    // Row 3
    { from: 10, to: 11 },
    { from: 11, to: 12 },
    { from: 12, to: 13 },
    { from: 13, to: 14 },

    // Row 4
    { from: 15, to: 16 },
    { from: 16, to: 17 },
    { from: 17, to: 18 },
    { from: 18, to: 19 },

    // Row 5
    { from: 20, to: 21 },
    { from: 21, to: 22 },
    { from: 22, to: 23 },
    { from: 23, to: 24 },

    // Vertical connections (top to bottom)
    // Column 1
    { from: 0, to: 5 },
    { from: 5, to: 10 },
    { from: 10, to: 15 },
    { from: 15, to: 20 },

    // Column 2
    { from: 1, to: 6 },
    { from: 6, to: 11 },
    { from: 11, to: 16 },
    { from: 16, to: 21 },

    // Column 3
    { from: 2, to: 7 },
    { from: 7, to: 12 },
    { from: 12, to: 17 },
    { from: 17, to: 22 },

    // Column 4
    { from: 3, to: 8 },
    { from: 8, to: 13 },
    { from: 13, to: 18 },
    { from: 18, to: 23 },

    // Column 5
    { from: 4, to: 9 },
    { from: 9, to: 14 },
    { from: 14, to: 19 },
    { from: 19, to: 24 },
  ],
};
