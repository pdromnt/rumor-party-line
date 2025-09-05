export const getServer = () => {
  if (Number(import.meta.env.VITE_STATIC)) {
    return window.location.origin;
  } else {
    return import.meta.env.VITE_SERVER;
  }
}