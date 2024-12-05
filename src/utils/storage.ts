export function getRealData(name: string) {
  if (typeof window !== "undefined") {
    return localStorage.getItem(name);
  }
  return null;
}

export function setRealData(name: string, value: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(name, value);
  }
}

export function removeRealData(name: string) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(name);
  }
}

export function removeAllRealData() {
  if (typeof window !== "undefined") {
    localStorage.clear();
    return true;
  }
  return false;
}
