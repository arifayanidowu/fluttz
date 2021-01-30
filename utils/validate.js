import * as Validator from "validatorjs";

export const validate = (data, rules, custom = {}, cb) => {
  const validate = new Validator(data, rules, custom);
  validate.passes(() => cb(null, true));
  validate.fails(() => cb(validate.errors, false));
};
