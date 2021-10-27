/**
 *
 * @param {String} s string to Properize
 * @returns {String} Properized string
 */
export const properize = (s: string): string =>
  s && s[0].toUpperCase() + s.slice(1).trim();
export const properizeNoTrim = (s: string): string =>
  s && s[0].toUpperCase() + s.slice(1);
export const properizeName = (name: string) => name.split(' ').map(n=>properize(n)).join(' ')

/**
 *
 * @param {Date} d javascript date object
 * @returns {String} string representation of the time with AM/PM
 */
export const returnTime = (d: Date) => {
  let m: string = "";
  let hour: string | number = d.getHours();
  let minute: string | number = d.getMinutes();
  m = hour >= 12 ? "PM" : "AM";
  hour = hour <= 12 ? hour : hour - 12;
  minute = minute < 10 ? `0${minute}` : minute;
  return `${hour}:${minute} ${m}`;
};

/**
 *
 * @param {Date} d javascript date object
 * @param {Number} h hours to add
 * @returns {Date} javascript date object + hours
 */
export const addHours = (d: Date, h: number): Date => {
  d.setTime(d.getTime() + h * 60 * 60 * 1000);
  return d;
};

/**
 * Function finds key of an object by the value
 * @param {Object} object to search
 * @param {String} value value to locate
 * @returns {String}
 */
export const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find((key: any) => object[key] === value);
};

export const formControl = {
  validateEmail: (emailAddress: string): boolean =>
    emailAddress.split("").includes("@") &&
    emailAddress.length >= 6 &&
    emailAddress.split("").includes("."),
  validatePasswordsMatch: (p1: string, p2: string): boolean => p1 === p2,
  validatePassword: (p1: string): boolean => p1.length >= 8,
  validateName: (name: string): boolean => name.split(' ').length > 1
};

export const returnTimeDifference = (d1: Date, d2: Date): string => {
  const m = Math.abs(Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60)));
  return m < 1
    ? "Less than 1m"
    : m < 60
    ? `${m}m`
    : m < 60 * 24
    ? `${(m - (m % 60)) / 60}h`
    : `${Math.floor(m / 24 / 60)}d`;
};
