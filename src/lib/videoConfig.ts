export const VIDEOS = {
  // Add your Google Drive File IDs here
  // You get the ID from the share link: https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing
  
  hero: {
    main: "", // Example: "1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
  },
  
  montage: [
    { id: "1c-beOO9SBVKHQIGIh84FGaxQjLILswe1", title: "Montage 1" },
    { id: "1LxC2ziXTmlzU6sW1BNz2K-c-ppw015wZ", title: "Montage 2" },
  ],
  
  talkingHead: [
    { id: "16BZqsKT9BiRBaZimUXIZlXBRXeCfTDoU", title: "Talking Head 1" },
    { id: "1bY3nWnQPaOcEHRM6toDnPtUXDzot0n6t", title: "Talking Head 2" },
  ],
  
  longForm: [
    { id: "1luCT68Jp12Sb83EiGs0p4PoA0gQdBD2p", title: "Long Form 1" },
    { id: "18kEbAglebVarqttwQRZrxZdysf4Gal8N", title: "Long Form 2" },
  ],
  
  weddings: [
    { id: "1PEpwVfwgxFqOW-G8OXf0HNQ8oD4LR232", title: "Wedding 1" },
    { id: "1tH_vr-nrb4cHJWrIuZ7RLZctsBoCOqv-", title: "Wedding 2" },
  ]
};

// Helper function to generate the direct download link from a file ID
export const getDriveDirectLink = (fileId: string) => {
  if (!fileId) return "";
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

// Helper function to fetch the auto-generated thumbnail from Google Drive
export const getDriveThumbnail = (fileId: string) => {
  if (!fileId) return "";
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};
