import { md5 } from "./md5";

export const calcSig = (payload: Record<string, string>, secret: string): string => {
  const str = Object.entries(payload)
    .sort((a, b) => {
      if (a[0] > b[0]) return 1;
      if (a[0] < b[0]) return -1;
      return 0;
    })
    .reduce((acc, cur) => {
      if (cur[0] !== "sig") acc += cur[0] + "=" + cur[1];
      return acc;
    }, "");

  return md5(str + secret);
};
