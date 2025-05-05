/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { jwtDecode } from 'jwt-decode';

function objectToString(obj: Record<string, any>): string {
  return JSON.stringify(obj);
}

function stringToObject(str: string): Record<string, any> | null {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

export { objectToString, stringToObject };

export const checkTokenExpiration = (token: string | null) => {
  try {
    if (!token) return true;
    const { exp } = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  } catch (e) {
    return true;
  }
};

export const refreshStatusUser = () => {
  localStorage.clear();
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}`;
};
