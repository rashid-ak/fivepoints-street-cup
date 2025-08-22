// Configuration for section background images
// Set backgroundImage to add a background to any section
// Set to null or undefined to remove background

export const sectionBackgrounds = {
  hero: {
    backgroundImage: "/lovable-uploads/e574c182-7471-4093-ba8d-82e81d9c8596.png",
    backgroundAlt: "Futsal tournament at Underground Atlanta with city skyline",
    overlayOpacity: 0.6
  },
  about: {
    backgroundImage: "/lovable-uploads/7819dfd3-f6af-406e-887f-85ec0cbcce27.png",
    backgroundAlt: "Players and spectators at futsal court with Atlanta skyline",
    overlayOpacity: 0.85
  },
  rules: {
    backgroundImage: "/lovable-uploads/0d09f1f6-3d40-42c5-a715-be70d6d84171.png",
    backgroundAlt: "Action shot of players competing on futsal court",
    overlayOpacity: 0.85
  },
  schedule: {
    backgroundImage: "/lovable-uploads/b01a2a2a-fa1c-4b0a-9c78-86c4ed26d0c7.png",
    backgroundAlt: "Close-up of soccer cleats and ball on court surface",
    overlayOpacity: 0.85
  },
  gallery: {
    backgroundImage: "/lovable-uploads/ed3a79cb-67b1-490f-87e3-c9a37e0913c0.png",
    backgroundAlt: "Players in action during futsal game at Underground Atlanta",
    overlayOpacity: 0.85
  },
  partners: {
    backgroundImage: "/lovable-uploads/0cd4d024-4bce-4fe0-8b10-377c28ded7e1.png",
    backgroundAlt: "5 Points Cup tournament logo with colorful geometric design",
    overlayOpacity: 0.9
  },
  footer: {
    backgroundImage: "/lovable-uploads/0d09f1f6-3d40-42c5-a715-be70d6d84171.png",
    backgroundAlt: "Futsal court action with Underground Atlanta branding",
    overlayOpacity: 0.9
  }
};

// Helper function to get background config for a section
export const getSectionBackground = (sectionName: keyof typeof sectionBackgrounds) => {
  return sectionBackgrounds[sectionName];
};