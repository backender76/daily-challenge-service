interface Request {
  body?: any;
  headers?: any;
  query?: any;
}

interface Response {
  send(data: any): void;
  status(data: any): Response;
}

const validation = {
  required: (value: any) => typeof value !== "undefined" && (!validation.string(value) || value !== ""),
  string: (value: any) => typeof value === "string",
  number: (value: any) => typeof value === "number",
  boolean: (value: any) => typeof value === "boolean",
  min: (value: any, min: number) => value >= min,
  range: (value: any, min: number, max: number) => value >= min && value <= max,
};

type ValidatorName = keyof typeof validation;

export const rules: Record<"NOT_EMPTY_STRING", [ValidatorName, ...params: any][]> = {
  NOT_EMPTY_STRING: [["required"], ["string"]],
};

export type ValidationRules = Record<string, [ValidatorName, ...params: any][]>;

export const validate = (context: "body" | "headers" | "query", config: ValidationRules) => {
  return function (req: Request, res: Response, next: (err?: any) => void) {
    for (let field in config) {
      const rules = Array.isArray(config[field]) ? config[field] : [config[field]];

      for (let rule of rules) {
        const value = req[context] && req[context][field];
        const [name, ...props] = rule;

        // @ts-ignore
        if (!validation[name].apply(validation, [value, ...props])) {
          const msg = name === "required" ? `is ${name}` : `must be a ${name}`;
          const error = `Field "${field}" ${msg}!`;
          console.warn(JSON.stringify({ error }));
          return res.status(400).send({ error });
        }
      }
    }
    next();
  };
};
