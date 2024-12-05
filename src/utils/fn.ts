export function money(str: any, suffix = "₮") {
  return Math.round(str * 1).toLocaleString("mn") + suffix;
}
