export const displayObjectInConsole = (obj: object) => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(obj, undefined, 2));
};