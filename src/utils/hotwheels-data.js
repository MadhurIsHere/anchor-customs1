// Hot Wheels product catalog - separated for maintainability
const HW_DESC = 'Premium, rare-to-find original Hot Wheels car. 100% authentic, carefully packed for safe delivery.';

const HW_DETAILS = {
  intro: "For the true collectors and die-cast enthusiasts — discover premium, rare-to-find original Hot Wheels cars that stand out in every collection. From limited editions to highly sought-after models, each piece is carefully sourced to ensure authenticity, quality, and collector value.",
  included: [
    "100% Original Hot Wheels",
    "Premium & Collector Editions",
    "Rare and Hard-to-Find Models",
    "Carefully Packed for Safe Delivery"
  ],
  required: [],
  perfectFor: [
    "Die-Cast Collectors",
    "Car Enthusiasts",
    "Birthday Gifts",
    "Display Collections"
  ],
  importantInfo: [
    "Because some cars are more than toys — they're collectibles.",
    "⚠️ Stock is extremely limited — only 1 unit per model!"
  ]
};

const hw = (id, img, name, price) => ({
  id: `hw_${img}`,
  name,
  price10: price,
  price12: price,
  originalPrice: price + 200,
  image: `/products/HOTWHEELS/${price}/${img}.jpg`,
  description: HW_DESC,
  category: 'Hot Wheels',
  isHotWheels: true,
  stock: 1,
  priceTier: price,
  details: { ...HW_DETAILS, importantInfo: [`Price: ₹${price}`, ...HW_DETAILS.importantInfo] }
});

export const HOTWHEELS_TEMPLATES = [
  // Featured / Cover
  hw(52, 'IMG_5190', 'McLaren W1', 899),

  // ₹399 Tier (16 cars)
  hw(1, 'IMG_5134', 'Ford Mustang Mach-E 1400', 399),
  hw(2, 'IMG_5135', 'Maserati Shamal', 399),
  hw(3, 'IMG_5136', 'Gordon Murray Automotive T.50s', 399),
  hw(4, 'IMG_5137', "'15 Land Rover Defender Double Cab", 399),
  hw(5, 'IMG_5138', '2019 Audi R8 Spyder', 399),
  hw(6, 'IMG_5139', "'68 Dodge Dart", 399),
  hw(7, 'IMG_5140', 'Gordon Murray Automotive T.33', 399),
  hw(8, 'IMG_5141', 'TV Series Batmobile (Batman Classic TV Series)', 399),
  hw(9, 'IMG_5142', 'Cadillac Project GTP Hypercar', 399),
  hw(10, 'IMG_5143', "'16 Cadillac ATS-V R", 399),
  hw(11, 'IMG_5149', 'Ford GT', 399),
  hw(12, 'IMG_5150', 'Austin Mini Cooper S', 399),
  hw(13, 'IMG_5151', "'67 Shelby GT500", 399),
  hw(14, 'IMG_5152', 'Nissan Skyline 2000 GT-R', 399),
  hw(15, 'IMG_5146', "'64 Impala", 399),
  hw(16, 'IMG_5147', 'Peugeot 9X8 Hypercar', 399),

  // ₹549 Tier (19 cars)
  hw(17, 'IMG_5155', 'BMW 2002', 549),
  hw(18, 'IMG_5157', '2020 Ford Mustang Shelby GT500', 549),
  hw(19, 'IMG_5158', 'The Simpsons Family Car', 549),
  hw(20, 'IMG_5159', 'The Dark Knight Batmobile', 549),
  hw(21, 'IMG_5160', 'Batman: Arkham Asylum Batmobile', 549),
  hw(22, 'IMG_5161', "'96 Dodge Viper GTS", 549),
  hw(23, 'IMG_5144', 'Batman & Robin Batmobile', 549),
  hw(24, 'IMG_5148', 'Muscle and Blown', 549),
  hw(25, 'IMG_5153', 'Mercedes-Benz 500 E', 549),
  hw(26, 'IMG_5154', 'BMW 635 CSi', 549),
  hw(27, 'IMG_5167', 'Mod Speeder', 549),
  hw(28, 'IMG_5168', '1970 Road Runner (Fast & Furious: Tokyo Drift)', 549),
  hw(29, 'IMG_5169', 'Nissan Silvia S15 (Fast & Furious: Tokyo Drift)', 549),
  hw(30, 'IMG_5170', 'Nissan 350Z Custom (Fast & Furious: Tokyo Drift)', 549),
  hw(31, 'IMG_5171', 'Nissan Silvia S13 (Fast & Furious: Tokyo Drift)', 549),
  hw(32, 'IMG_5172', '1970 Monte Carlo (Fast & Furious: Tokyo Drift)', 549),
  hw(33, 'IMG_5163', 'Audi 90 Quattro', 549),
  hw(34, 'IMG_5165', 'Land Rover Defender 90', 549),
  hw(35, 'IMG_5166', 'Formula E Gen3', 549),

  // ₹699 Tier (10 cars)
  hw(36, 'IMG_5175', 'Nissan Skyline GT-R (BCNR33)', 699),
  hw(37, 'IMG_5176', 'Batmobile (The Batman)', 699),
  hw(38, 'IMG_5177', '1983 Porsche 928S', 699),
  hw(39, 'IMG_5178', "'96 Porsche Carrera", 699),
  hw(40, 'IMG_5180', 'Mazda 787B', 699),
  hw(41, 'IMG_5183', "'17 Audi RS 6 Avant", 699),
  hw(42, 'IMG_5191', 'Spider-Man (Marvel)', 699),
  hw(43, 'IMG_5145', 'Maserati Tipo 61 Birdcage', 699),
  hw(44, 'IMG_5162', "'89 Mercedes-Benz 560 SEC AMG", 699),
  hw(45, 'IMG_5164', 'Ferrari 365 GTB4 Competizione', 699),

  // ₹899 Tier (12 cars)
  hw(46, 'IMG_5184', 'Pagani Utopia', 899),
  hw(47, 'IMG_5185', '2020 Koenigsegg Jesko', 899),
  hw(48, 'IMG_5186', "'16 Lamborghini Centenario Roadster", 899),
  hw(49, 'IMG_5187', 'LB-Works Lamborghini Huracán Coupé', 899),
  hw(50, 'IMG_5188', 'Visa Cash App RB Formula One Team', 899),
  hw(51, 'IMG_5189', 'Ferrari 12Cilindri', 899),
  hw(53, 'IMG_5156', 'Porsche 911 Turbo Cabriolet (White)', 899),
  hw(54, 'IMG_5179', 'Porsche 911 Turbo Cabriolet (Maroon)', 899),
  hw(55, 'IMG_5182', 'Bugatti Bolide', 899),
  hw(56, 'IMG_5193', 'Nissan 240SX S14 (Fast & Furious Premium)', 899),
  hw(57, 'IMG_5192', 'Porsche Panamera Turbo S E-Hybrid (Hybrid Speed)', 899),
];
