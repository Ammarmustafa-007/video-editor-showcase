export const VIDEOS = {
  // Add your Google Drive File IDs here
  // You get the ID from the share link: https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing
  
  hero: {
    main: "", // Example: "1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
  },
  
  montage: [
    { id: "1c-beOO9SBVKHQIGIh84FGaxQjLILswe1", title: "Montage 1" },
    { id: "14JTHhjS6qNC-F_aeBLp9OGO77FhzBJ8e", title: "Montage 2" },
    { id: "1jaijdgqf3AWzKW2cEKZlg5-p_V66waZB", title: "Montage 3" },
    { id: "107BAvyVsIjKoH_NbVvxLJwW-6symCk5u", title: "Montage 4" },
    { id: "1AMBfznm4L4dwhL4NJRhaSOdAFswjRAX7", title: "Montage 5" },
    { id: "1Yay2Z2EqYd6Kl67M_50oBFIdO3cTIJFn", title: "Montage 6" },
    { id: "1OD1m23hjHkta5gDn6vsIEs5hN5RNAHxk", title: "Montage 7" },
    { id: "1soYcU50O61YBb4AGaOMVMu9HNX56NBZc", title: "Montage 8" },
    { id: "1S47EiPascuGthtmEc48R1aDZhreJX4nO", title: "Montage 9" },
    { id: "1QzmWGHowsKKQUQgEvPo0HKKxPS4gh7cn", title: "Montage 10" },
    { id: "1_-COoSqhmHzwBlU0hkOwGelkz0QnZjeb", title: "Montage 11" },
    { id: "1N-PcwpkUNx4TZ7CAR9LfuzSF3v9xY5Hm", title: "Montage 12" },
    { id: "1e1PbXzpWXo-O86h5srq4Z75EEaYeRikO", title: "Montage 13" },
    { id: "1AJqUFcRR2m_Cttfl7rYfHwsg__U4mKVm", title: "Montage 14" },
    { id: "1YMDQOQoxLZsvfWS8KYOTARN-yw5yQ7lD", title: "Montage 15" },
    { id: "1m8Iy0AzTJxFliw4Dqe7iZBnJ8GzP59_7", title: "Montage 16" },
    { id: "1ZpHTUXBxUyLeijfsljLCOWPYPe7N2zKz", title: "Montage 17" },
    { id: "1t5XxJC59ziGWm-tIFAJ_fNhTcvTrfv-i", title: "Montage 18" },
    { id: "1vjO7yseLKju_u4jSVjC7JATZ_IK-h-t5", title: "Montage 19" },
    { id: "1rP_vzYTxx502XqvKdkreo1wPBhsLSGrT", title: "Montage 20" },
    { id: "1PcD-qaEWXS_6e1P_1XmRLJvIdl77fl8t", title: "Montage 21" }
  ],
  
  talkingHead: [
    { id: "1vimMXESjgh5lowwjDEiyRZRTCLY6dUwZ", title: "Talking Head 1" },
    { id: "1fcB3lNsNXitlpPra4fvneY8MicwMLYAm", title: "Talking Head 2" },
    { id: "1YunU6jTGYAp2bauxID3T1M1E2-N9Mxa1", title: "Talking Head 3" },
    { id: "1nZ88LKxroW8h4B9zCn_nUvjEUhP-ZKjc", title: "Talking Head 4" },
    { id: "1Dvg-wsa9qBau-b7i-I0fmYRpOu4PBkrC", title: "Talking Head 5" },
    { id: "1Q47Emdfqf_d98OaMykz1gOhfsgTgnres", title: "Talking Head 6" },
    { id: "1wFYwQio4mcLdQF7di79PXeRNd_YGtDjh", title: "Talking Head 7" },
    { id: "1LTHnfmSINgEAE60BRjNn0ARSXIztPuG6", title: "Talking Head 8" },
    { id: "100txo2zfjmgw9PXuE3uW3adXaYvmWxVF", title: "Talking Head 9" },
    { id: "1JRyXNl3Wzp9pbWxnHxbyBkahlZHoIC3L", title: "Talking Head 10" },
    { id: "1XAdd-iAiqf4NMeXCoCiFpvkouTwzZDMB", title: "Talking Head 11" }
  ],
  
  longForm: [
    { id: "18kEbAglebVarqttwQRZrxZdysf4Gal8N", title: "Long Form 1" },
    { id: "1luCT68Jp12Sb83EiGs0p4PoA0gQdBD2p", title: "Long Form 2" },
    { id: "1SLC6CMvb3yis89ia--Lgc1ISr_wo_iwe", title: "Long Form 3" },
    { id: "1FrCQLwzD9AKJaZIogb0N95hyMp9Jsdjs", title: "Long Form 4" },
    { id: "1_r35e3jQXjXnYUYThKrv85-a2p-YZb4E", title: "Long Form 5" }
  ],
  
  weddings: [
    { id: "1PEpwVfwgxFqOW-G8OXf0HNQ8oD4LR232", title: "Wedding 1" },
    { id: "1tH_vr-nrb4cHJWrIuZ7RLZctsBoCOqv-", title: "Wedding 2" },
  ]
};

// Helper function to generate the direct download link from a file ID
export const getDriveDirectLink = (fileId: string) => {
  if (!fileId) return "";
  return `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`;
};

// Helper function to fetch the auto-generated thumbnail from Google Drive
export const getDriveThumbnail = (fileId: string) => {
  if (!fileId) return "";
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};
