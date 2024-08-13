export const emojiToBase64 = (emoji: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
                 <rect width="100%" height="100%" fill="#47104C" />
                 <text x="50%" y="50%" font-size="70" dy=".35em" text-anchor="middle">${emoji}</text>
               </svg>`;
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
};
