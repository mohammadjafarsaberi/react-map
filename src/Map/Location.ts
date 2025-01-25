export type CustomLocation = {
  locationName: string;
  latitude: number;
  longitude: number;
};

export const initialLocations: CustomLocation[] = [
  // Famous locations from Kabul
  {
    locationName: "Darul Aman Palace",
    latitude: 34.4672,
    longitude: 69.1164,
  },
  {
    locationName: "Pul-e Khishti Mosque",
    latitude: 34.5141,
    longitude: 69.1777,
  },
  {
    locationName: "Babur Gardens",
    latitude: 34.5034,
    longitude: 69.1575,
  },
  {
    locationName: "National Museum of Afghanistan",
    latitude: 34.4603,
    longitude: 69.1196,
  },

  {
    locationName: "Kabul Zoo",
    latitude: 34.5177,
    longitude: 69.1796,
  },
  {
    locationName: "Shahr-e Naw Park",
    latitude: 34.5324,
    longitude: 69.1652,
  },
  {
    locationName: "Shah-Do Shamshira Mosque",
    latitude: 34.5186,
    longitude: 69.1806,
  },

  // Famous locations from Kandahar

  {
    locationName: "Mandawi Bazaar",
    latitude: 31.6182,
    longitude: 65.7103,
  },
  {
    locationName: "Miran Shah Bazaar",
    latitude: 31.6178,
    longitude: 65.7118,
  },
  {
    locationName: "Kandahar Park",
    latitude: 31.6205,
    longitude: 65.7086,
  },
  {
    locationName: "Qala-e-Bost Fortress",
    latitude: 31.5954,
    longitude: 65.7199,
  },

  // Famous locations from Herat

  {
    locationName: "Jihad Garden",
    latitude: 34.3501,
    longitude: 62.2113,
  },
  {
    locationName: "Minarets of Herat",
    latitude: 34.3361,
    longitude: 62.2107,
  },
  {
    locationName: "Park of Herat",
    latitude: 34.3521,
    longitude: 62.2145,
  },

  // Famous locations from Takhar
  {
    locationName: "Rustaq Grand Mosque",
    latitude: 36.5785,
    longitude: 69.6627,
  },
  {
    locationName: "Takhar Martyrs Monument",
    latitude: 36.7307,
    longitude: 69.5346,
  },
];
