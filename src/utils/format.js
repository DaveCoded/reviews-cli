/**
 * Format a list of strings such that they are comma-separated,
 * with an "and" before the last item.
 * @param {*} strList - An array of strings to format.
 * @returns {string} - A formatted string.
 */
export function formatList(strList) {
  if (strList.length === 0) {
    return "";
  } else if (strList.length === 1) {
    return strList[0];
  } else if (strList.length === 2) {
    return `${strList[0]} and ${strList[1]}`;
  } else {
    const lastItem = strList.pop();
    return `${strList.join(", ")}, and ${lastItem}`;
  }
}
