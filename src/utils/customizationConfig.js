export const getCustomizationConfig = (template) => {
  if (!template) return null;

  const config = {
    requiresCover: false,
    minPhotos: 0,
    maxPhotos: 0,
    customTextFields: [],
    allowSpecialInstructions: true // All products support this
  };

  const name = template.name.toLowerCase();
  const category = template.category?.toLowerCase() || '';

  // 1. Magazine (all except Standing Magazine)
  if (category === 'magazine' && !name.includes('standing')) {
    config.requiresCover = true;
    config.minPhotos = 20;
    config.maxPhotos = 30;
  }
  // 2. Standing Magazine
  else if (category === 'magazine' && name.includes('standing')) {
    config.requiresCover = true;
    config.minPhotos = 15;
    config.maxPhotos = 30;
  }
  // 3. Spotify Code Frame
  else if (name.includes('spotify')) {
    config.minPhotos = 1;
    config.maxPhotos = 1;
    config.customTextFields.push({
      id: 'spotify_song',
      label: 'Your Song Name & Artist',
      placeholder: 'e.g., Tum Hi Ho by Arijit Singh',
      icon: '🎵'
    });
  }
  // 4. Polaroid Frame
  else if (name.includes('polaroid')) {
    config.minPhotos = 4;
    config.maxPhotos = 5;
    config.customTextFields.push({
      id: 'custom_message',
      label: 'Your Custom Message',
      placeholder: 'Enter your custom message',
      icon: '✍️'
    });
  }
  // 5. Long Distance Frame
  else if (name.includes('long distance')) {
    config.minPhotos = 4;
    config.maxPhotos = 5;
    config.customTextFields.push({
      id: 'monuments_cities',
      label: 'Monuments / Cities to Feature',
      placeholder: 'e.g., Delhi & Toronto',
      icon: '🗺️'
    });
  }
  // 6. Chaos Collage Frame
  else if (name.includes('chaos collage') && !category.includes('combo')) {
    config.minPhotos = 5;
    config.maxPhotos = 6;
    config.customTextFields.push({
      id: 'custom_message',
      label: 'Your Custom Message',
      placeholder: 'Enter your custom message',
      icon: '✍️'
    });
  }
  // 7. Hopeless Romantic Frame
  else if (name.includes('hopeless romantic')) {
    config.minPhotos = 3;
    config.maxPhotos = 4;
    config.customTextFields.push({
      id: 'custom_message',
      label: 'Your Custom Message',
      placeholder: 'Enter your custom message',
      icon: '💌'
    });
  }
  // 8. Digital Diary Frame
  else if (name.includes('digital diary')) {
    config.minPhotos = 10;
    config.maxPhotos = 12;
    config.customTextFields.push({
      id: 'song_lyrics',
      label: 'Song Lyrics to Feature',
      placeholder: 'Enter song lyrics',
      icon: '🎶'
    });
  }
  // 9. Photo Booth Frame
  else if (name.includes('photo booth')) {
    config.minPhotos = 3;
    config.maxPhotos = 3;
  }
  // 10. Archive of Us Frame
  else if (name.includes('archive of us')) {
    config.minPhotos = 4;
    config.maxPhotos = 4;
    config.customTextFields.push({
      id: 'relationship_title',
      label: 'Your Relationship / Title',
      placeholder: 'e.g., Forever Us',
      icon: '💛'
    });
  }
  // 11. Pop Grid Frame
  else if (name.includes('pop grid') && !category.includes('combo')) {
    config.minPhotos = 6;
    config.maxPhotos = 7;
  }
  // 12. Pieces of Us Frame
  else if (name.includes('pieces of us')) {
    config.minPhotos = 25;
    config.maxPhotos = 30;
    config.customTextFields.push({
      id: 'names_message',
      label: 'Names or Custom Message',
      placeholder: 'Enter names or message',
      icon: '💕'
    });
  }
  // 13. The Lover's Deck
  else if (name.includes('lover\'s deck') || name.includes('lovers deck')) {
    config.minPhotos = 8;
    config.maxPhotos = 8;
  }
  // 14. Combo 1 (Mag + Pop Grid)
  else if (name.includes('combo 1') || (name.includes('combo') && name.includes('pop grid'))) {
    config.requiresCover = true;
    config.minPhotos = 40;
    config.maxPhotos = 45;
  }
  // 15. Combo 2 (Mag + Chaos Collage)
  else if (name.includes('combo 2') || (name.includes('combo') && name.includes('chaos collage'))) {
    config.requiresCover = true;
    config.minPhotos = 40;
    config.maxPhotos = 45;
    config.customTextFields.push({
      id: 'chaos_message',
      label: 'Custom Message for Chaos Collage',
      placeholder: 'Enter your custom message',
      icon: '✍️'
    });
  }
  // 16. Combo 3 (Mag + Hot Wheels)
  else if (name.includes('combo 3') || (name.includes('combo') && name.includes('hot wheels'))) {
    config.requiresCover = true;
    config.minPhotos = 30;
    config.maxPhotos = 35;
  }
  // 17. The Ultimate Hamper
  else if (name.includes('ultimate hamper')) {
    config.requiresCover = true;
    config.minPhotos = 30;
    config.maxPhotos = 35;
  }
  // 18. Customised Calendar
  else if (name.includes('calendar')) {
    config.minPhotos = 12;
    config.maxPhotos = 12;
  }
  // 19. Scrapbook
  else if (category === 'scrapbook' || name.includes('scrapbook')) {
    config.minPhotos = 35;
    config.maxPhotos = 40;
  }
  // 20. Hotwheels Bouquet / Hot Wheels / Kaleshi Aurat / Any other zero-photo items
  else if (category.includes('hot wheels') || name.includes('bouquet') || name.includes('kaleshi')) {
    config.minPhotos = 0;
    config.maxPhotos = 0;
    config.allowSpecialInstructions = false;
  }

  return config;
};
