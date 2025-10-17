export const once = <Fn extends Function>(fn: Fn) => {
  let called: boolean = false;
  return function (this: any, ...args: any): any {
    if (!called) {
      called = true;
      return fn.apply(this, args);
    }
  };
};
