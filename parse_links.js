const talkingHead = `
https://drive.google.com/file/d/1vimMXESjgh5lowwjDEiyRZRTCLY6dUwZ/view?usp=drive_link
https://drive.google.com/file/d/1fcB3lNsNXitlpPra4fvneY8MicwMLYAm/view?usp=drive_link
https://drive.google.com/file/d/1YunU6jTGYAp2bauxID3T1M1E2-N9Mxa1/view?usp=drive_link
https://drive.google.com/file/d/1nZ88LKxroW8h4B9zCn_nUvjEUhP-ZKjc/view?usp=drive_link
https://drive.google.com/file/d/1Dvg-wsa9qBau-b7i-I0fmYRpOu4PBkrC/view?usp=drive_link
https://drive.google.com/file/d/1Q47Emdfqf_d98OaMykz1gOhfsgTgnres/view?usp=drive_link
https://drive.google.com/file/d/1wFYwQio4mcLdQF7di79PXeRNd_YGtDjh/view?usp=drive_link
https://drive.google.com/file/d/1LTHnfmSINgEAE60BRjNn0ARSXIztPuG6/view?usp=drive_link
https://drive.google.com/file/d/100txo2zfjmgw9PXuE3uW3adXaYvmWxVF/view?usp=drive_link
https://drive.google.com/file/d/100txo2zfjmgw9PXuE3uW3adXaYvmWxVF/view?usp=drive_link
https://drive.google.com/file/d/1JRyXNl3Wzp9pbWxnHxbyBkahlZHoIC3L/view?usp=drive_link
https://drive.google.com/file/d/1XAdd-iAiqf4NMeXCoCiFpvkouTwzZDMB/view?usp=drive_link
`.trim().split('\n');

const montage = `
https://drive.google.com/file/d/1c-beOO9SBVKHQIGIh84FGaxQjLILswe1/view?usp=drive_link
https://drive.google.com/file/d/14JTHhjS6qNC-F_aeBLp9OGO77FhzBJ8e/view?usp=drive_link
https://drive.google.com/file/d/1jaijdgqf3AWzKW2cEKZlg5-p_V66waZB/view?usp=drive_link
https://drive.google.com/file/d/107BAvyVsIjKoH_NbVvxLJwW-6symCk5u/view?usp=drive_link
https://drive.google.com/file/d/1AMBfznm4L4dwhL4NJRhaSOdAFswjRAX7/view?usp=drive_link
https://drive.google.com/file/d/1Yay2Z2EqYd6Kl67M_50oBFIdO3cTIJFn/view?usp=drive_link
https://drive.google.com/file/d/1OD1m23hjHkta5gDn6vsIEs5hN5RNAHxk/view?usp=drive_link
https://drive.google.com/file/d/1soYcU50O61YBb4AGaOMVMu9HNX56NBZc/view?usp=drive_link
https://drive.google.com/file/d/1S47EiPascuGthtmEc48R1aDZhreJX4nO/view?usp=drive_link
https://drive.google.com/file/d/1QzmWGHowsKKQUQgEvPo0HKKxPS4gh7cn/view?usp=drive_link
https://drive.google.com/file/d/1_-COoSqhmHzwBlU0hkOwGelkz0QnZjeb/view?usp=drive_link
https://drive.google.com/file/d/1N-PcwpkUNx4TZ7CAR9LfuzSF3v9xY5Hm/view?usp=drive_link
https://drive.google.com/file/d/1e1PbXzpWXo-O86h5srq4Z75EEaYeRikO/view?usp=drive_link
https://drive.google.com/file/d/1AJqUFcRR2m_Cttfl7rYfHwsg__U4mKVm/view?usp=drive_link
https://drive.google.com/file/d/1YMDQOQoxLZsvfWS8KYOTARN-yw5yQ7lD/view?usp=drive_link
https://drive.google.com/file/d/1m8Iy0AzTJxFliw4Dqe7iZBnJ8GzP59_7/view?usp=drive_link
https://drive.google.com/file/d/1ZpHTUXBxUyLeijfsljLCOWPYPe7N2zKz/view?usp=drive_link
https://drive.google.com/file/d/1t5XxJC59ziGWm-tIFAJ_fNhTcvTrfv-i/view?usp=drive_link
https://drive.google.com/file/d/1vjO7yseLKju_u4jSVjC7JATZ_IK-h-t5/view?usp=drive_link
https://drive.google.com/file/d/1rP_vzYTxx502XqvKdkreo1wPBhsLSGrT/view?usp=drive_link
https://drive.google.com/file/d/1PcD-qaEWXS_6e1P_1XmRLJvIdl77fl8t/view?usp=drive_link
`.trim().split('\n');

const longForm = `
https://drive.google.com/file/d/18kEbAglebVarqttwQRZrxZdysf4Gal8N/view?usp=drive_link
https://drive.google.com/file/d/1luCT68Jp12Sb83EiGs0p4PoA0gQdBD2p/view?usp=drive_link
https://drive.google.com/file/d/1SLC6CMvb3yis89ia--Lgc1ISr_wo_iwe/view?usp=drive_link
https://drive.google.com/file/d/1FrCQLwzD9AKJaZIogb0N95hyMp9Jsdjs/view?usp=drive_link
https://drive.google.com/file/d/1_r35e3jQXjXnYUYThKrv85-a2p-YZb4E/view?usp=drive_link
`.trim().split('\n');

const getIds = (list) => [...new Set(list.map(url => {
  const match = url.match(/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}).filter(Boolean))];

const thIds = getIds(talkingHead);
const mIds = getIds(montage);
const lfIds = getIds(longForm);

console.log('TALKING HEAD:');
console.log(JSON.stringify(thIds.map((id, i) => ({ id, title: `Talking Head ${i + 1}` })), null, 2));

console.log('\nMONTAGE:');
console.log(JSON.stringify(mIds.map((id, i) => ({ id, title: `Montage ${i + 1}` })), null, 2));

console.log('\nLONG FORM:');
console.log(JSON.stringify(lfIds.map((id, i) => ({ id, title: `Long Form ${i + 1}` })), null, 2));
