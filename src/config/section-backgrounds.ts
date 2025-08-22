// Configuration for section background images
// Set backgroundImage to add a background to any section
// Set to null or undefined to remove background

export const sectionBackgrounds = {
  hero: {
    backgroundImage: "/lovable-uploads/0cd4d024-4bce-4fe0-8b10-377c28ded7e1.png",
    backgroundAlt: "5 Points Cup tournament logo with colorful geometric design",
    overlayOpacity: 0.6
  },
  about: {
    backgroundImage: undefined, // Add image path here to enable background
    backgroundAlt: "About section background",
    overlayOpacity: 0.8
  },
  rules: {
    backgroundImage: undefined, // Add image path here to enable background
    backgroundAlt: "Tournament rules background", 
    overlayOpacity: 0.8
  },
  schedule: {
    backgroundImage: undefined, // Add image path here to enable background
    backgroundAlt: "Event schedule background",
    overlayOpacity: 0.8
  },
  gallery: {
    backgroundImage: undefined, // Add image path here to enable background
    backgroundAlt: "Gallery section background",
    overlayOpacity: 0.8
  },
  partners: {
    backgroundImage: undefined, // Add image path here to enable background
    backgroundAlt: "Partners section background",
    overlayOpacity: 0.8
  },
  footer: {
    backgroundImage: undefined, // Add image path here to enable background
    backgroundAlt: "Footer section background",
    overlayOpacity: 0.8
  }
};

// Helper function to get background config for a section
export const getSectionBackground = (sectionName: keyof typeof sectionBackgrounds) => {
  return sectionBackgrounds[sectionName];
};