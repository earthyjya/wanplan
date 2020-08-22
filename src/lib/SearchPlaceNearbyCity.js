import axios from "axios";
const cities = [
  {
    city_id: 13,
    city: "Fukuoka",
    lat: 33.5901838,
    long: 130.401718,
  },
  {
    city_id: 6,
    city: "Himeji",
    lat: 34.815147,
    long: 134.685349,
  },
  {
    city_id: 5,
    city: "Hiroshima",
    lat: 34.385204,
    long: 132.455292,
  },
  {
    city_id: 2,
    city: "Kanazawa",
    lat: 36.560001,
    long: 136.640015,
  },
  {
    city_id: 7,
    city: "Kobe",
    lat: 34.688896,
    long: 135.193977,
  },
  {
    city_id: 8,
    city: "Kyoto",
    lat: 35.01858,
    long: 135.763835,
  },
  {
    city_id: 1,
    city: "Nagoya",
    lat: 35.155397,
    long: 136.903381,
  },
  {
    city_id: 9,
    city: "Osaka",
    lat: 34.685293,
    long: 135.514694,
  },
  {
    city_id: 15,
    city: "Sendai",
    lat: 38.266651,
    long: 140.869446,
  },
  {
    city_id: 3,
    city: "Shizuoka",
    lat: 34.977119,
    long: 138.383087,
  },
  {
    city_id: 12,
    city: "Tokyo",
    lat: 35.6803997,
    long: 139.7690174,
  },
  {
    city_id: 11,
    city: "Yokohama",
    lat: 35.443707,
    long: 139.638031,
  },
  { city: "Hatsukaichi", city_id: 4, lat: 34.348505, long: 132.331833 },
  { city: "Suita", city_id: 10, lat: 34.759779, long: 135.515799 },
  { city: "Naha", city_id: 14, lat: 26.20047, long: 127.728577 },
];

export default async function (APIServer, plan_overview) {
  const city = cities.filter(
    (location) => location.city == plan_overview.city
    )[0]
    if (!city) return [];
    const cityLat = city.lat;
    const cityLong = city.long;
    return FindNearby(APIServer,cityLat,cityLong)
  }

export const FindNearby = async (APIServer, lat, long, type, radius) => {
  // let url =
  //   APIServer +
  //   "/googlenearby?lat=" +
  //   lat +
  //   "&lng=" +
  //   long +
  //   "&type=" +
  //   type +
  //   "&radius=" +
  //   radius;
  // console.log(url);
  // return axios
  //   .get(url)
  //   .then((res) => res.data)
  //   .catch((err) => console.log(err));
  return [];
};
