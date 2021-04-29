/* eslint-disable prefer-arrow/prefer-arrow-functions */
export function safe(fun: () => any, value: any) {
  if (value) { fun(); }
}
export function auth(em) {
  return em ? em.startsWith('cats') ||
    em.startsWith('mengi') ||
    em.startsWith('ekl') ||
    em.startsWith('lussi') ||
    em.startsWith('day') : false;
}
