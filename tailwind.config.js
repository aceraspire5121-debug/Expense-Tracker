module.exports = {
  content: [
    "./*.html",
    "./*.js",
    "./frontend/**/*.{html,js}",
    "./src/**/*.{html,js}",
    "./components/**/*.{html,js}"
  ],

  safelist: [
    // spacing
    "gap-1","gap-2","gap-3","gap-4","gap-5","gap-6",
    "gap-x-1","gap-x-2","gap-x-3","gap-x-4","gap-x-5","gap-x-6",
    "gap-y-1","gap-y-2","gap-y-3","gap-y-4","gap-y-5","gap-y-6",

    // grid
    "grid",
    "grid-cols-1","grid-cols-2","grid-cols-3","grid-cols-4",
    "md:grid-cols-2",
    "col-span-1","col-span-2",

    // overflow
    "overflow-auto","overflow-y-auto","overflow-scroll","overflow-y-scroll",

    // size
    "h-full","w-full","h-screen","w-screen"
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};
