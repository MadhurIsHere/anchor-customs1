import fs from 'fs';
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
  image: `/products/HOTWHEELS/${price}/${img}.jpg`,
  description: HW_DESC,
  category: 'Hot Wheels',
  isHotWheels: true,
  stock: 1,
  priceTier: price,
  details: { ...HW_DETAILS, importantInfo: [`Price: ₹${price}`, ...HW_DETAILS.importantInfo] }
});

const HOTWHEELS_TEMPLATES = [
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
  hw(52, 'IMG_5190', 'McLaren W1', 899),
  hw(53, 'IMG_5156', 'Porsche 911 Turbo Cabriolet (White)', 899),
  hw(54, 'IMG_5179', 'Porsche 911 Turbo Cabriolet (Maroon)', 899),
  hw(55, 'IMG_5182', 'Bugatti Bolide', 899),
  hw(56, 'IMG_5193', 'Nissan 240SX S14 (Fast & Furious Premium)', 899),
  hw(57, 'IMG_5192', 'Porsche Panamera Turbo S E-Hybrid (Hybrid Speed)', 899),
];



const TEMPLATES = [
  {
    id: 'mag_chaar_kadam',
    name: 'Chaar Kadam Magazine',
    price10: 999,
    price12: 999,
    originalPrice: 1200,
    image: '/products/MAGAZINE TEMPLATES/CHAAR KADAM-WEBSITE.jpg',
    description: 'Your camera roll, but make it iconic.',
    category: 'Magazine',
    pages: Array.from({length: 11}, (_, i) => `/products/MAGAZINE TEMPLATES/CHAAR KADAM-WEBSITE_page_${i + 1}.jpg`),
    details: {
      intro: "Your camera roll, but make it iconic.",
      included: [
        "12 Pages (24 Sides)",
        "Premium Quality Printing",
        "Aesthetic Layouts & Edits",
        "Texts, Captions & Memories",
        "Carefully Designed To Match Your Vibe"
      ],
      required: [
        "35–40 Photos",
        "(Minimum 20 Photos Required)",
        "Have more memories? We can also increase the number of pages accordingly ✨"
      ],
      perfectFor: [
        "Anniversaries",
        "Birthdays",
        "Couple Gifts",
        "Friendship Gifts",
        "Long Distance Relationships",
        "Memory Keepsakes"
      ],
      importantInfo: [
        "Price: ₹999",
        "Privacy Policy: Your order will never be posted on our page without your permission. We deeply respect your privacy and personal memories 🤍"
      ]
    }
  },
  {
    id: 'mag_khat',
    name: 'Khat Magazine',
    price10: 999,
    price12: 999,
    originalPrice: 1200,
    image: '/products/MAGAZINE TEMPLATES/KHAT-WEBSITE.jpg',
    description: 'Your camera roll, but make it iconic.',
    category: 'Magazine',
    pages: Array.from({length: 11}, (_, i) => `/products/MAGAZINE TEMPLATES/KHAT-WEBSITE_page_${i + 1}.jpg`),
    details: {
      intro: "Your camera roll, but make it iconic.",
      included: [
        "12 Pages (24 Sides)",
        "Premium Quality Printing",
        "Aesthetic Layouts & Edits",
        "Texts, Captions & Memories",
        "Carefully Designed To Match Your Vibe"
      ],
      required: [
        "35–40 Photos",
        "(Minimum 20 Photos Required)",
        "Have more memories? We can also increase the number of pages accordingly ✨"
      ],
      perfectFor: [
        "Anniversaries",
        "Birthdays",
        "Couple Gifts",
        "Friendship Gifts",
        "Long Distance Relationships",
        "Memory Keepsakes"
      ],
      importantInfo: [
        "Price: ₹999",
        "Privacy Policy: Your order will never be posted on our page without your permission. We deeply respect your privacy and personal memories 🤍"
      ]
    }
  },
  {
    id: 'mag_le_dooba',
    name: 'Le Dooba Magazine',
    price10: 999,
    price12: 999,
    originalPrice: 1200,
    image: '/products/MAGAZINE TEMPLATES/LE DOOBA-WEBSITE.jpg',
    description: 'Your camera roll, but make it iconic.',
    category: 'Magazine',
    pages: Array.from({length: 11}, (_, i) => `/products/MAGAZINE TEMPLATES/LE DOOBA-WEBSITE_page_${i + 1}.jpg`),
    details: {
      intro: "Your camera roll, but make it iconic.",
      included: [
        "12 Pages (24 Sides)",
        "Premium Quality Printing",
        "Aesthetic Layouts & Edits",
        "Texts, Captions & Memories",
        "Carefully Designed To Match Your Vibe"
      ],
      required: [
        "35–40 Photos",
        "(Minimum 20 Photos Required)",
        "Have more memories? We can also increase the number of pages accordingly ✨"
      ],
      perfectFor: [
        "Anniversaries",
        "Birthdays",
        "Couple Gifts",
        "Friendship Gifts",
        "Long Distance Relationships",
        "Memory Keepsakes"
      ],
      importantInfo: [
        "Price: ₹999",
        "Privacy Policy: Your order will never be posted on our page without your permission. We deeply respect your privacy and personal memories 🤍"
      ]
    }
  },
  {
    id: 'mag_tu_chahiye',
    name: 'Tu Chahiye Magazine',
    price10: 999,
    price12: 999,
    originalPrice: 1200,
    image: '/products/MAGAZINE TEMPLATES/TU CHAHIYE-WEBSITE.jpg',
    description: 'Your camera roll, but make it iconic.',
    category: 'Magazine',
    pages: Array.from({length: 11}, (_, i) => `/products/MAGAZINE TEMPLATES/TU CHAHIYE-WEBSITE_page_${i + 1}.jpg`),
    details: {
      intro: "Your camera roll, but make it iconic.",
      included: [
        "12 Pages (24 Sides)",
        "Premium Quality Printing",
        "Aesthetic Layouts & Edits",
        "Texts, Captions & Memories",
        "Carefully Designed To Match Your Vibe"
      ],
      required: [
        "35–40 Photos",
        "(Minimum 20 Photos Required)",
        "Have more memories? We can also increase the number of pages accordingly ✨"
      ],
      perfectFor: [
        "Anniversaries",
        "Birthdays",
        "Couple Gifts",
        "Friendship Gifts",
        "Long Distance Relationships",
        "Memory Keepsakes"
      ],
      importantInfo: [
        "Price: ₹999",
        "Privacy Policy: Your order will never be posted on our page without your permission. We deeply respect your privacy and personal memories 🤍"
      ]
    }
  },
  {
    id: 'mag_rozana',
    name: 'Rozana Magazine',
    price10: 999,
    price12: 999,
    originalPrice: 1200,
    image: '/products/MAGAZINE TEMPLATES/ROZANA-WEBSITE_page_1.jpg',
    description: 'Your camera roll, but make it iconic.',
    category: 'Magazine',
    pages: Array.from({length: 24}, (_, i) => `/products/MAGAZINE TEMPLATES/ROZANA-WEBSITE_page_${i + 1}.jpg`),
    details: {
      intro: "Your camera roll, but make it iconic.",
      included: [
        "12 Pages (24 Sides)",
        "Premium Quality Printing",
        "Aesthetic Layouts & Edits",
        "Texts, Captions & Memories",
        "Carefully Designed To Match Your Vibe"
      ],
      required: [
        "35–40 Photos",
        "(Minimum 20 Photos Required)",
        "Have more memories? We can also increase the number of pages accordingly ✨"
      ],
      perfectFor: [
        "Anniversaries",
        "Birthdays",
        "Couple Gifts",
        "Friendship Gifts",
        "Long Distance Relationships",
        "Memory Keepsakes"
      ],
      importantInfo: [
        "Price: ₹999",
        "Privacy Policy: Your order will never be posted on our page without your permission. We deeply respect your privacy and personal memories 🤍"
      ]
    }
  },
  {
    id: 'mag_shayarana',
    name: 'Shayarana Magazine',
    price10: 999,
    price12: 999,
    originalPrice: 1200,
    image: '/products/MAGAZINE TEMPLATES/SHAYARANA-WEBSITE_page_1.jpg',
    description: 'Your camera roll, but make it iconic.',
    category: 'Magazine',
    pages: Array.from({length: 12}, (_, i) => `/products/MAGAZINE TEMPLATES/SHAYARANA-WEBSITE_page_${i + 1}.jpg`),
    details: {
      intro: "Your camera roll, but make it iconic.",
      included: [
        "12 Pages (24 Sides)",
        "Premium Quality Printing",
        "Aesthetic Layouts & Edits",
        "Texts, Captions & Memories",
        "Carefully Designed To Match Your Vibe"
      ],
      required: [
        "35–40 Photos",
        "(Minimum 20 Photos Required)",
        "Have more memories? We can also increase the number of pages accordingly ✨"
      ],
      perfectFor: [
        "Anniversaries",
        "Birthdays",
        "Couple Gifts",
        "Friendship Gifts",
        "Long Distance Relationships",
        "Memory Keepsakes"
      ],
      importantInfo: [
        "Price: ₹999",
        "Privacy Policy: Your order will never be posted on our page without your permission. We deeply respect your privacy and personal memories 🤍"
      ]
    }
  },
  {
    id: 'mag_tera_mera_rishta',
    name: 'Tera Mera Rishta Magazine',
    price10: 999,
    price12: 999,
    originalPrice: 1200,
    image: '/products/MAGAZINE TEMPLATES/TERA MERA RISHTA-WEBSITE_page_1.jpg',
    description: 'Your camera roll, but make it iconic.',
    category: 'Magazine',
    pages: Array.from({length: 16}, (_, i) => `/products/MAGAZINE TEMPLATES/TERA MERA RISHTA-WEBSITE_page_${i + 1}.jpg`),
    details: {
      intro: "Your camera roll, but make it iconic.",
      included: [
        "12 Pages (24 Sides)",
        "Premium Quality Printing",
        "Aesthetic Layouts & Edits",
        "Texts, Captions & Memories",
        "Carefully Designed To Match Your Vibe"
      ],
      required: [
        "35–40 Photos",
        "(Minimum 20 Photos Required)",
        "Have more memories? We can also increase the number of pages accordingly ✨"
      ],
      perfectFor: [
        "Anniversaries",
        "Birthdays",
        "Couple Gifts",
        "Friendship Gifts",
        "Long Distance Relationships",
        "Memory Keepsakes"
      ],
      importantInfo: [
        "Price: ₹999",
        "Privacy Policy: Your order will never be posted on our page without your permission. We deeply respect your privacy and personal memories 🤍"
      ]
    }
  },
  {
    id: 'mag_normal',
    name: 'Normal Magazine',
    price10: 999,
    price12: 999,
    originalPrice: 1200,
    image: '/products/MAGAZINE TEMPLATES/NORMAL TEMPLATE-WEBSITE_page_3.jpg',
    description: 'Your camera roll, but make it iconic.',
    category: 'Magazine',
    popular: true,
    pages: Array.from({length: 11}, (_, i) => `/products/MAGAZINE TEMPLATES/NORMAL TEMPLATE-WEBSITE_page_${i + 1}.jpg`),
    details: {
      intro: "Your camera roll, but make it iconic.",
      included: [
        "12 Pages (24 Sides)",
        "Premium Quality Printing",
        "Aesthetic Layouts & Edits",
        "Texts, Captions & Memories",
        "Carefully Designed To Match Your Vibe"
      ],
      required: [
        "35–40 Photos",
        "(Minimum 20 Photos Required)",
        "Have more memories? We can also increase the number of pages accordingly ✨"
      ],
      perfectFor: [
        "Anniversaries",
        "Birthdays",
        "Couple Gifts",
        "Friendship Gifts",
        "Long Distance Relationships",
        "Memory Keepsakes"
      ],
      importantInfo: [
        "Price: ₹999",
        "Privacy Policy: Your order will never be posted on our page without your permission. We deeply respect your privacy and personal memories 🤍"
      ]
    }
  },
  {
    id: 'frame_spotify',
    name: 'Spotify Code',
    price10: 699,
    price12: 699,
    originalPrice: 899,
    image: '/products/FRAMES/a4 frames website_page_13.jpg',
    gallery: [
      '/products/FRAMES/a4 frames website_page_13.jpg',
      '/products/FRAMES/a4 frames website_page_14.jpg',
      '/products/FRAMES/a4 frames website_page_15.jpg'
    ],
    description: 'A frame that feels like your song in physical form.',
    category: 'Frames',
    customizableField: {
      label: '🎵 Your Song Name & Artist',
      placeholder: 'e.g. Tum Hi Ho by Arijit Singh',
      hint: 'Share the song you want featured on your Spotify frame — we will generate the exact Spotify code for it!'
    },
    details: {
      intro: "A frame that feels like your song in physical form. Designed with a music-player inspired layout, this frame captures memories that instantly take you back to a special moment 🤍",
      size: "A4 Size",
      price: "₹699",
      perfectFor: ["Couple Gifts", "Anniversary Surprises", "Song Dedications", "Romantic Memories"],
      whatMakesItSpecial: ["Spotify-inspired aesthetic layout", "Personalized photo & song design", "Premium quality print & frame", "Minimal yet emotional vibe"]
    }
  },
  {
    id: 'frame_aesthetic',
    name: 'Polaroid',
    price10: 699,
    price12: 699,
    originalPrice: 899,
    image: '/products/FRAMES/a4 frames website_page_4.jpg',
    gallery: [
      '/products/FRAMES/a4 frames website_page_4.jpg',
      '/products/FRAMES/a4 frames website_page_5.jpg',
      '/products/FRAMES/a4 frames website_page_6.jpg'
    ],
    description: 'A collection of memories that feel warm, personal, and timeless.',
    category: 'Frames',
    customizableField: {
      label: '✍️ Your Custom Message',
      placeholder: 'e.g. "Best days of my life" or a short quote you love',
      hint: 'This message will be printed beautifully on your Polaroid frame.'
    },
    details: {
      intro: "A collection of memories that feel warm, personal, and timeless. Designed with hanging vintage-style pictures to give your moments a soft nostalgic touch ✨",
      size: "A4 Size",
      price: "₹699",
      perfectFor: ["Best Friends", "Couple Gifts", "Birthday Surprises", "Friendship Memories"],
      whatMakesItSpecial: ["Vintage-inspired hanging layout", "Soft aesthetic design", "Personalized text & memories", "Cozy Pinterest-style vibe"]
    }
  },
  {
    id: 'frame_long_distance',
    name: 'Long Distance',
    price10: 699,
    price12: 699,
    originalPrice: 899,
    image: '/products/FRAMES/a4 frames website_page_1.jpg',
    gallery: [
      '/products/FRAMES/a4 frames website_page_1.jpg',
      '/products/FRAMES/a4 frames website_page_2.jpg',
      '/products/FRAMES/a4 frames website_page_3.jpg'
    ],
    description: 'Distance means nothing when someone means everything.',
    category: 'Frames',
    customizableField: {
      label: '🗺️ Monuments / Cities to Feature',
      placeholder: 'e.g. Eiffel Tower & Taj Mahal / Delhi & Mumbai',
      hint: 'Tell us the monuments or cities you want shown on your Long Distance frame — we will design it around them!'
    },
    details: {
      intro: "Distance means nothing when someone means everything. This frame beautifully captures love, memories, and the feeling of staying connected no matter how far apart you are 💌",
      size: "A4 Size",
      price: "₹699",
      perfectFor: ["Long Distance Couples", "Travel Memories", "Emotional Surprise Gifts", "Relationship Keepsakes"],
      whatMakesItSpecial: ["Scrapbook-inspired aesthetic", "Travel & memory collage layout", "Personalized design elements", "Vintage emotional vibe"]
    }
  },
  {
    id: 'frame_chaos',
    name: 'Chaos Collage',
    price10: 699,
    price12: 699,
    originalPrice: 899,
    image: '/products/FRAMES/a4 frames website_page_7.jpg',
    gallery: [
      '/products/FRAMES/a4 frames website_page_7.jpg',
      '/products/FRAMES/a4 frames website_page_8.jpg',
      '/products/FRAMES/a4 frames website_page_9.jpg'
    ],
    description: 'A chaotic, adorable collection of all the moments that made your story special.',
    category: 'Frames',
    customizableField: {
      label: '✍️ Your Custom Message',
      placeholder: 'e.g. "Chaos is us" or any short quote / caption',
      hint: 'This message will appear on your Chaos Collage frame — make it yours!'
    },
    details: {
      intro: "A chaotic, adorable collection of all the moments that made your story special. Designed with fun sticker-style layouts that feel playful, trendy, and full of personality ✨",
      size: "A4 Size",
      price: "₹699",
      perfectFor: ["Anniversary Gifts", "Couple Surprises", "Birthday Gifts", "Friendship Memories"],
      whatMakesItSpecial: ["Sticker-inspired collage design", "Trendy Pinterest-style aesthetic", "Multiple personalized photos", "Fun & vibrant memory layout"]
    }
  },
  {
    id: 'frame_hopeless',
    name: 'Hopeless Romantic',
    price10: 699,
    price12: 699,
    originalPrice: 899,
    image: '/products/FRAMES/a4 frames website_page_10.jpg',
    gallery: [
      '/products/FRAMES/a4 frames website_page_10.jpg',
      '/products/FRAMES/a4 frames website_page_11.jpg',
      '/products/FRAMES/a4 frames website_page_12.jpg'
    ],
    description: 'Cute, soft, romantic, and straight out of a Pinterest board.',
    category: 'Frames',
    customizableField: {
      label: '💌 Your Custom Message',
      placeholder: 'e.g. "You are my favorite person" or a romantic quote',
      hint: 'This sweet message will be woven into your Hopeless Romantic frame design.'
    },
    details: {
      intro: "Cute, soft, romantic, and straight out of a Pinterest board. This frame is designed for the people who love dreamy aesthetics and meaningful memories together 🤍",
      size: "A4 Size",
      price: "₹699",
      perfectFor: ["Wedding Memories", "Couple Gifts", "Romantic Surprises", "Soft Aesthetic Lovers"],
      whatMakesItSpecial: ["Elegant scrapbook-inspired design", "Soft neutral tones", "Personalized text & layouts", "Premium aesthetic finish"]
    }
  },
  {
    id: 'frame_film_strip',
    name: 'Digital Diary',
    price10: 649,
    price12: 649,
    originalPrice: 849,
    image: '/products/FRAMES/8x8 frames website1_page_4.jpg',
    gallery: [
      '/products/FRAMES/8x8 frames website1_page_4.jpg',
      '/products/FRAMES/8x8 frames website1_page_5.jpg',
      '/products/FRAMES/8x8 frames website1_page_6.jpg'
    ],
    description: 'Like your favorite memories captured straight from a movie scene.',
    category: 'Frames',
    customizableField: {
      label: '🎶 Song Lyrics to Feature',
      placeholder: 'e.g. "Tujhe kitna chahne lage hum, tujhe kitna chahte hai"',
      hint: 'Share the lyrics you want featured on your Digital Diary frame — we will style them beautifully!'
    },
    details: {
      intro: "Like your favorite memories captured straight from a movie scene. A nostalgic frame designed to preserve moments that deserve a replay forever ✨",
      size: "8x8 Inches",
      price: "₹649",
      perfectFor: ["Best Friends", "Couple Memories", "Birthday Gifts", "Throwback Moments"],
      whatMakesItSpecial: ["Vintage film-strip inspired layout", "Multiple photo placements", "Fun & nostalgic vibe", "Compact aesthetic decor piece"]
    }
  },
  {
    id: 'frame_pieces_of_us',
    name: 'Photo Booth',
    price10: 699,
    price12: 699,
    originalPrice: 899,
    image: '/products/FRAMES/a4 frames website_page_16.jpg',
    gallery: [
      '/products/FRAMES/a4 frames website_page_16.jpg',
      '/products/FRAMES/a4 frames website_page_17.jpg',
      '/products/FRAMES/a4 frames website_page_18.jpg'
    ],
    description: 'A collection of moments that fit together perfectly.',
    category: 'Frames',
    details: {
      intro: "A collection of moments that fit together perfectly. This notebook-inspired layout captures your favorite highlights in a trendy, personalized way 💌",
      size: "A4 Size",
      price: "₹699",
      perfectFor: ["Friendship Gifts", "Couple Gifts", "Memory Decor", "Minimal Aesthetic Lovers"],
      whatMakesItSpecial: ["Notebook-inspired aesthetic", "Clean minimal design", "Emotional & personalized feel", "Trendy paper-plane elements"]
    }
  },
  {
    id: 'frame_pinteresty',
    name: 'Archive of Us',
    price10: 649,
    price12: 649,
    originalPrice: 849,
    image: '/products/FRAMES/8x8 frames website1_page_1.jpg',
    gallery: [
      '/products/FRAMES/8x8 frames website1_page_1.jpg',
      '/products/FRAMES/8x8 frames website1_page_2.jpg',
      '/products/FRAMES/8x8 frames website1_page_3.jpg'
    ],
    description: 'For the person who feels like home.',
    category: 'Frames',
    customizableField: {
      label: '💛 Your Relationship / Title',
      placeholder: 'e.g. "My Person", "Dil Ka Dost", "Best Friend", "My Favourite Human"',
      hint: 'Tell us how you want to define this relationship — it will be featured as the title of your Archive of Us frame. Make it as personal as you like 💛'
    },
    details: {
      intro: "For the person who feels like home. A cute personalized frame celebrating friendship, chaos, memories, and unconditional support 💛",
      size: "8x8 Inches",
      price: "₹649",
      perfectFor: ["Best Friend Gifts", "Birthday Surprises", "Friendship Day", "School/College Memories"],
      whatMakesItSpecial: ["Scrapbook-inspired layout", "Personalized title & photos", "Warm nostalgic aesthetic", "Handmade memory-book feel"]
    }
  },
  {
    id: 'frame_pop_grid',
    name: 'Pop Grid',
    price10: 549,
    price12: 549,
    originalPrice: 749,
    image: '/products/FRAMES/5  7 inches frame_page_1.jpg',
    gallery: [
      '/products/FRAMES/5  7 inches frame_page_1.jpg',
      '/products/FRAMES/5  7 inches frame_page_2.jpg',
      '/products/FRAMES/5  7 inches frame_page_3.jpg'
    ],
    description: 'A timeless aesthetic designed for memories that never go out of style.',
    category: 'Frames',
    details: {
      intro: "A timeless aesthetic designed for memories that never go out of style. Simple, elegant, and deeply personal with a clean modern grid layout ✨",
      size: "5x7 Inches",
      price: "₹549",
      perfectFor: ["Minimal Aesthetic Decor", "Friendship Memories", "Couple Photos", "Bedroom/Desk Decor"],
      whatMakesItSpecial: ["Modern grid-style photo layout", "Elegant minimal vibe", "Compact & classy design", "Personalized memory aesthetic"]
    }
  },
  {
    id: 'frame_memory',
    name: 'Pieces of Us',
    price10: 649,
    price12: 649,
    originalPrice: 849,
    image: '/products/FRAMES/8x8 frames website1_page_7.jpg',
    gallery: [
      '/products/FRAMES/8x8 frames website1_page_7.jpg',
      '/products/FRAMES/8x8 frames website1_page_8.jpg',
      '/products/FRAMES/8x8 frames website1_page_9.jpg'
    ],
    description: 'A frame filled with chaos, laughter, memories, and the people who made life unforgettable.',
    category: 'Frames',
    customizableField: {
      label: '💕 Names or Custom Message',
      placeholder: 'e.g. "Arjun & Priya" or "Forever & Always" or any short message',
      hint: 'Add the names of the people in the frame, or a short message that means everything — we will make it look stunning on your Pieces of Us frame 💕'
    },
    details: {
      intro: "A frame filled with chaos, laughter, memories, and the people who made life unforgettable ✨",
      size: "8x8 Inches",
      price: "₹649",
      perfectFor: ["Wedding Memories", "Couple Gifts", "Anniversary Surprises", "Heart Collage Lovers"],
      whatMakesItSpecial: ["Heart-shaped photo collage", "Bold contrast design", "Emotional & personalized feel", "Premium room decor piece"]
    }
  },
  {
    id: 'hamper',
    name: 'The Ultimate Hamper',
    price10: 2999,
    price12: 2999,
    originalPrice: 3299,
    image: '/products/hamper_cover.jpg',
    description: 'The ultimate custom gift collection 🤍',
    category: 'Hamper',
    popular: false,
    imageFit: 'contain',
    pageBg: '#fdfdfd',
    pages: [
      ...Array.from({length: 16}, (_, i) => `/products/HAMPER/sakstin hamper magazine _page_${i + 1}.jpg`),
      '/products/HAMPER/sakstin 57 frame wesbite hamper.jpg',
      '/products/HAMPER/a4 frames website hamper.jpg',
      '/products/hotwheels.jpg',
      '/products/HAMPER/1.jpg'
    ],
    pageLabels: [
      ...Array.from({length: 16}, () => 'Customized Magazine'),
      'Small Frame',
      'Big Frame',
      'Hot Wheels',
      'Personalized Letter'
    ],
    details: {
      intro: "The ultimate custom gift collection — designed to turn your favorite memories into something unforgettable 🤍",
      included: [
        "Custom Magazine: 12 pages (24 sides) of customized magazine capturing your core memories",
        "Two Customized Frames: One sticker-type frame and one aesthetic pop-grid frame with your photos",
        "Personalized Letter: A heartfelt handwritten-style note customized for your loved one",
        "Hot Wheels Collectible: A cute fun element added to complete the hamper"
      ],
      required: [
        "30–50 High Quality Photos"
      ],
      perfectFor: [
        "Anniversaries",
        "Birthday Surprises",
        "Couple Gifts",
        "Best Friend Gifts",
        "Special Memory Collections"
      ],
      importantInfo: [
        "Materials: Premium Printed Paper",
        "Delivery Time: 1–2 Weeks",
        "Customization: 100% Personalized"
      ]
    }
  },
  {
    id: 'calendar',
    name: 'Customised Calendar',
    price10: 999,
    price12: 999,
    originalPrice: 1200,
    image: '/products/CUSTOMISED CALENDAR/customized calendar_page_1.jpg',
    aspectRatio: '5/4',
    description: 'Start every month with a memory that makes you smile ✨',
    category: 'Calendar',
    popular: false,
    imageFit: 'contain',
    pageBg: '#fdfdfd',
    pages: Array.from({length: 14}, (_, i) => `/products/CUSTOMISED CALENDAR/customized calendar_page_${i + 1}.jpg`),
    details: {
      intro: "Start every month with a memory that makes you smile ✨\n\nA personalized aesthetic calendar designed with your favorite photos and moments.",
      included: [
        "14-Sided Printed Calendar",
        "Fully Customized Photo Layouts",
        "Premium Print Quality",
        "Aesthetic & Minimal Design"
      ],
      required: [
        "12 Photos"
      ],
      perfectFor: [
        "Couple Memories",
        "Friendship Memories",
        "Birthday Gifts",
        "New Year Gifts",
        "Desk & Room Decor"
      ],
      importantInfo: [
        "Price: ₹999",
        "Privacy Policy: We value your trust. Your order will never be posted publicly without your permission."
      ]
    }
  },
  {
    id: 'scrapbook',
    name: 'Scrapbook',
    price10: 1299,
    price12: 1299,
    originalPrice: 1499,
    image: '/products/SCRAPBOOK/_SCRAPBOOK - website_page_1.jpg',
    aspectRatio: '5/4',
    description: 'A handmade customized scrapbook capturing your best moments.',
    category: 'Scrapbook',
    popular: false,
    pageBg: '#fdfdfd',
    pages: Array.from({length: 24}, (_, i) => `/products/SCRAPBOOK/_SCRAPBOOK - website_page_${i + 1}.jpg`).filter(p => !p.endsWith('_page_2.jpg') && !p.endsWith('_page_23.jpg')),
    details: {
      intro: "A beautifully handcrafted scrapbook designed to preserve your most special memories in the most personal and aesthetic way possible. Every page is carefully designed to feel meaningful and unique to you.",
      required: [
        "35–40 Photos",
        "We can also increase the number of pages if you have more photos to include."
      ],
      importantInfo: [
        "Online Payments Only (UPI)",
        "No Cash on Delivery"
      ],
      privacy: "Your order will never be posted on our page without your permission. We completely respect your privacy and ensure that all your memories and pictures remain safe and personal."
    }
  },
  {
    id: 'standing_magazine',
    name: 'Standing Magazine',
    price10: 1399,
    price12: 1399,
    originalPrice: 1599,
    image: '/products/standing magazine/standing magazine_page_1.jpg',
    description: 'A unique standing magazine display for your desk.',
    category: 'Standing Magazine',
    popular: false,
    imageFit: 'cover',
    pageBg: '#fdfdfd',
    pages: Array.from({length: 15}, (_, i) => `/products/standing magazine/standing magazine_page_${i + 1}.jpg`),
    details: {
      intro: "Turn your favorite memories into a real aesthetic standing magazine made just for you. Designed with a premium white base stand so you can proudly place it on your shelves or desks.",
      included: [
        "15 Sided Printed Standing Magazine",
        "Premium Quality Printing",
        "Elegant White Base Stand",
        "Aesthetic Layouts & Edits",
        "Texts, Captions & Memories",
        "Carefully Designed To Match Your Theme & Vibe"
      ],
      required: [
        "25–30 Photos (Minimum 15 Photos Required)",
        "Have more memories? We can also increase the number of pages accordingly ✨"
      ],
      perfectFor: [
        "Friendship Gifts",
        "Family Memories",
        "Couple Gifts",
        "Birthdays",
        "Anniversaries",
        "Farewell Gifts",
        "Long Distance Relationships",
        "Memory Keepsakes"
      ],
      privacy: "Your order will never be posted on our page without your permission. We deeply respect your privacy and personal memories 🤍"
    }
  },

  {
    id: 'kaleshi_aurat',
    name: 'Kaleshi Aurat Cap',
    price10: 499,
    price12: 499,
    originalPrice: 699,
    image: '/products/KALESHI AURAT/686f6b42-274f-4201-b05d-1f74e5f995df.jpg',
    description: 'A statement piece for every unapologetic girl 🤍💋',
    category: 'Cap',
    popular: false,
    gallery: [
      '/products/KALESHI AURAT/686f6b42-274f-4201-b05d-1f74e5f995df.jpg',
      '/products/KALESHI AURAT/c6c54c39-f7fe-4442-b808-19bc9c8a6957.jpg'
    ],
    details: {
      intro: "A statement piece for every unapologetic girl. Made with premium breathable cotton, this white cap features elegant maroon embroidery with the iconic 'kaleshi aurat' text and smooch detail.",
      included: [
        "Premium cotton fabric",
        "High-quality embroidered detailing",
        "Adjustable back strap",
        "Lightweight & comfortable fit",
        "Minimal aesthetic with bold personality"
      ],
      importantInfo: [
        "Because being a little kaleshi is a lifestyle 💋"
      ]
    }
  },
  {
    id: 'combo_mag_grid',
    name: 'Combo 1 — Customized Magazine + Pop Grid',
    price10: 1499,
    price12: 1499,
    originalPrice: 1699,
    image: '/products/COMBO 1/5  7 inches frame.jpg',
    description: 'A perfect blend of memories and aesthetics.',
    category: 'Combo',
    pages: [
      ...Array.from({length: 9}, (_, i) => `/products/COMBO 1/NORMAL TEMPLATE-WEBSITE_page_${i + 3}.jpg`),
      '/products/COMBO 1/5  7 inches frame.jpg'
    ],
    pageLabels: [
      ...Array.from({length: 9}, () => 'Customized Magazine'),
      'Pop Grid Frame'
    ],
    details: {
      intro: "A perfect blend of memories and aesthetics.\nThis combo includes our signature customized magazine paired with a beautifully designed pop grid frame.",
      included: [
        "1x Customized Magazine",
        "1x Pop Grid Frame",
        "Premium Print Quality",
        "Aesthetic Layouts & Edits"
      ],
      required: [
        "40-45 Photos"
      ],
      perfectFor: [
        "Partner",
        "Best Friend",
        "Family",
        "Anniversaries & Birthdays"
      ]
    }
  },
  {
    id: 'combo_mag_chaos',
    name: 'Combo 2 — Customized Magazine + Chaos Collage',
    price10: 1599,
    price12: 1599,
    originalPrice: 1799,
    image: '/products/COMBO 2/a4 frames website.jpg',
    description: 'A perfect combination of storytelling and creative memories.',
    category: 'Combo',
    pages: [
      ...Array.from({length: 9}, (_, i) => `/products/COMBO 2/NORMAL TEMPLATE-WEBSITE_page_${i + 3}.jpg`),
      '/products/COMBO 2/a4 frames website.jpg'
    ],
    pageLabels: [
      ...Array.from({length: 9}, () => 'Customized Magazine'),
      'Chaos Collage Frame'
    ],
    details: {
      intro: "A perfect combination of storytelling and creative memories.\nThis combo includes our signature customized magazine along with a chaos collage frame.",
      included: [
        "1x Customized Magazine",
        "1x Chaos Collage Frame",
        "Premium Print Quality",
        "Aesthetic Layouts & Edits"
      ],
      required: [
        "40-45 Photos"
      ],
      perfectFor: [
        "Relationship & Friendship",
        "Birthdays",
        "Anniversaries",
        "Celebrating Moments that Matter"
      ]
    }
  },
  {
    id: 'combo_mag_wheels',
    name: 'Combo 3 — Customized Magazine + Hot Wheels',
    price10: 1499,
    price12: 1499,
    originalPrice: 1699,
    image: '/products/COMBO 3/5  7 inches frame (1).jpg',
    description: 'A unique combination created for people who love memories with a touch of personality and fun.',
    category: 'Combo',
    pages: [
      ...Array.from({length: 9}, (_, i) => `/products/COMBO 3/NORMAL TEMPLATE-WEBSITE_page_${i + 3}.jpg`),
      '/products/COMBO 3/5  7 inches frame (1).jpg',
      '/products/hotwheels.jpg'
    ],
    pageLabels: [
      ...Array.from({length: 9}, () => 'Customized Magazine'),
      'Frame',
      'Hot Wheels'
    ],
    details: {
      intro: "A unique combination created for people who love memories with a touch of personality and fun.\nThis combo includes our signature customized magazine paired with a Hot Wheels car.",
      included: [
        "1x Customized Magazine",
        "1x Hot Wheels Car",
        "Premium Print Quality",
        "Aesthetic Layouts & Edits"
      ],
      required: [
        "35-40 Photos"
      ],
      perfectFor: [
        "Birthdays",
        "Anniversaries",
        "Friendships",
        "Car Lovers & Collectors",
        "Surprising someone with something different"
      ]
    }
  },
  {
    id: 'bouquet',
    name: 'Bouquet of Hotwheels',
    price10: 2300,
    price12: 2300,
    originalPrice: 2600,
    image: '/products/IMG_6614.MOV',
    gallery: [
      '/products/IMG_6614.MOV',
      '/products/IMG_6612.jpg'
    ],
    description: 'A bouquet made with Hot Wheels, nostalgia, and love.',
    category: 'Bouquet',
    popular: true,
    details: {
      intro: "For the boy who still gets excited over tiny cars like it’s childhood all over again. 🚗💙\nA bouquet made with Hot Wheels, nostalgia, and love, because flowers are pretty, but this feels more like him.\n\nEach bouquet is handcrafted with carefully wrapped Hot Wheels cars and premium bouquet styling for a clean, aesthetic look.",
      included: [
        "Handcrafted bouquet of Hot Wheels",
        "Premium bouquet styling",
        "Carefully wrapped cars"
      ],
      importantInfo: [
        "Price: ₹2300 (including shipping)",
        "Cars will be added based on availability",
        "Designs and car models may vary"
      ],
      perfectFor: [
        "Collectors",
        "Best friends",
        "Partners",
        "Car enthusiasts"
      ],
      privacy: "A bouquet, but make it horsepower. 🏁"
    }
  },
  // Hot Wheels products
  ...HOTWHEELS_TEMPLATES
];

const allImages = new Set();
const addImage = (img) => {
  if (img && typeof img === 'string') allImages.add(decodeURIComponent(img.split('?')[0]));
};
for (const t of [...TEMPLATES, ...HOTWHEELS_TEMPLATES]) {
  addImage(t.image);
  if (t.gallery) t.gallery.forEach(addImage);
  if (t.pages) t.pages.forEach(addImage);
  if (t.coverPhoto) addImage(t.coverPhoto);
}
addImage('/products/Surprise-box.jpeg');
addImage('/products/MAGAZINE TEMPLATES/CHAAR KADAM-WEBSITE.jpg');
addImage('/products/MAGAZINE TEMPLATES/LE DOOBA-WEBSITE.jpg');
addImage('/products/HAMPER/1.jpg');
addImage('/products/FRAMES/a4 frames website_page_7.jpg');
addImage('/products/IMG_6614.MOV');
addImage('/products/IMG_6612.jpg');
fs.writeFileSync('used_files.json', JSON.stringify(Array.from(allImages), null, 2));
