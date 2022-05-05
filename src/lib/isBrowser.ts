export function isBrowser() {
  // Check if the environment is Node.js
  // @ts-ignore
  if (typeof process === 'object' && typeof require === 'function') {
    return false;
  }

  // Check if the environment is a
  // Service worker
  // @ts-ignore
  if (typeof importScripts === 'function') {
    return false;
  }

  // Check if the environment is a Browser
  // @ts-ignore
  if (typeof window === 'object') {
    return true;
  }
}
