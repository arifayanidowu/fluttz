import { validate } from "../utils/validate.js";

const runConditions = (condition, match, conditionValue, dataValue) => {
  if (condition === match && conditionValue === dataValue) {
    return true;
  } else {
    return false;
  }
};

/* 
eq - equals
neq - not equals
gt - greater than
gte - greater than or equals
contains - should contain condition value
*/
export const validateMiddleware = async (req, res, next) => {
  let { data, rule } = req.body;

  if ((typeof rule || typeof data) !== "object") {
    return res.status(400).json({
      message: "Invalid JSON payload passed.",
      status: "error",
      data: null,
    });
  }

  if (!rule.field) {
    return res.status(400).json({
      message: "rule is required.",
      status: "error",
      data: null,
    });
  }

  if (typeof rule.field === "number") {
    return res.status(400).json({
      message: `rule should be an object.`,
      status: "error",
      data: null,
    });
  }

  if (typeof data === "object" && !data.hasOwnProperty(rule.field)) {
    // if (typeof rule === "string" && rule?.includes(".")) {
    //   let arr = rule?.field?.split(".");
    //   if (!data[arr[0]].hasOwnProperty(arr[1])) {
    //     return res.status(400).json({
    //       message: `field ${rule.field} is missing from data.`,
    //       status: "error",
    //       data: null,
    //     });
    //   }
    // }
    return res.status(400).json({
      message: `field ${rule.field} is missing from data.`,
      status: "error",
      data: null,
    });
  }

  if (
    typeof data === "object" &&
    typeof rule.condition_value !== typeof data[rule.field]
  ) {
    return res.status(400).json({
      message: `${
        data[rule.field]
      } should be a|an ${typeof rule.condition_value}.`,
      status: "error",
      data: null,
    });
  }

  if (
    typeof data === "string" &&
    rule.condition === "eq" &&
    rule.condition_value !== data
  ) {
    return res.status(400).json({
      message: `field ${rule.field} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: rule.field,
          field_value: data[rule.field],
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  } else if (
    typeof data === "object" &&
    rule.condition === "eq" &&
    rule.field.includes(".")
  ) {
    let arr = rule?.field?.split(".");
    arr.forEach((item, i) => {
      console.log(data[arr[i]]);
    });
  }

  if (rule.condition === "gte") {
    if (
      data[rule.field] > rule.condition_value ||
      data[rule.field] === rule.condition_value
    ) {
      return next();
    }
    return res.status(400).json({
      message: `field ${rule.field} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: rule.field,
          field_value: data[rule.field],
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  }

  if (rule.condition === "gt") {
    if (data[rule.field] > rule.condition_value) {
      return next();
    }
    return res.status(400).json({
      message: `field ${rule.field} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: rule.field,
          field_value: data[rule.field],
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  }

  if (rule.condition === "neq") {
    if (data[rule.field] !== rule.condition_value) {
      return next();
    }
    return res.status(400).json({
      message: `field ${rule.field} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: rule.field,
          field_value: data[rule.field],
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  }

  next();
};
