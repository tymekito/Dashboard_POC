// mockData.js - Grid of points with resolution 0.05, origin (0,0)

export const mockData = {
  robots: [
    {
      id: 1,
      name: "Robot Alpha",
      batteryLevel: 85,
      isOnMission: true,
      mission: {
        name: "Patrol Zone A",
        destination: "A5",
      },
    },
    {
      id: 2,
      name: "Robot Beta",
      batteryLevel: 42,
      isOnMission: false,
      mission: {
        name: "Bezczynność",
        destination: "Brak",
      },
    },
    {
      id: 3,
      name: "Robot Gamma",
      batteryLevel: 95,
      isOnMission: true,
      mission: {
        name: "Delivery C2->E3",
        destination: "E3",
      },
    },
    {
      id: 4,
      name: "Robot Delta",
      batteryLevel: 18,
      isOnMission: false,
      mission: {
        name: "Bezczynność",
        destination: "Brak",
      },
    },
    {
      id: 5,
      name: "Robot Epsilon",
      batteryLevel: 73,
      isOnMission: true,
      mission: {
        name: "Security Check",
        destination: "D4",
      },
    },
  ],
};
