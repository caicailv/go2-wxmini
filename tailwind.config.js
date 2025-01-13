/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Vite 的入口文件
    "./src/**/*.{vue,js,ts,jsx,tsx}", // 匹配 src 目录下的所有 Vue 和 JS 文件
  ],
  theme: {
    extend: {}, // 自定义扩展配置
  },
  plugins: [],
};
