/// <reference types="vite/client" />

// Khai báo cho các asset import kiểu Vite `?url` (vd worker của pdf.js)
declare module '*?url' {
  const url: string;
  export default url;
}
