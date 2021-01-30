import { failedValidationMessage, missingDataMessage } from "../utils/index.js";

/* 
eq - equals
neq - not equals
gt - greater than
gte - greater than or equals
contains - should contain condition value
*/

export const validateMiddleware = async (req, res, next) => {
  let { data, rule } = req.body;

  //Deep Nested object Check start
  if (rule.condition === "eq" && rule?.field?.includes(".")) {
    let arr = rule?.field?.split(".");

    if (!data[arr[0]].hasOwnProperty(arr[1])) {
      missingDataMessage(res, rule, data);
    } else if (data[arr[0]][arr[1]] !== rule.condition_value) {
      failedValidationMessage(res, rule, data);
    } else {
      return next();
    }
  }

  // Deep nested :gt:
  if (rule.condition === "gt" && rule?.field?.includes(".")) {
    let arr = rule?.field?.split(".");

    if (!data[arr[0]].hasOwnProperty(arr[1])) {
      missingDataMessage(res, rule, data);
    } else if (data[arr[0]][arr[1]] > rule.condition_value) {
      return next();
    } else {
      failedValidationMessage(res, rule, data);
    }
  }

  // Deep nested :gte:
  if (rule.condition === "gte" && rule?.field?.includes(".")) {
    let arr = rule?.field?.split(".");

    if (!data[arr[0]].hasOwnProperty(arr[1])) {
      missingDataMessage(res, rule, data);
    } else if (
      data[arr[0]][arr[1]] > rule.condition_value ||
      data[arr[0]][arr[1]] === rule.condition_value
    ) {
      return next();
    } else {
      failedValidationMessage(res, rule, data);
    }
  }

  // Deep nested :neq:
  if (rule.condition === "neq" && rule?.field?.includes(".")) {
    let arr = rule?.field?.split(".");

    if (!data[arr[0]].hasOwnProperty(arr[1])) {
      missingDataMessage(res, rule, data);
    } else if (data[arr[0]][arr[1]] !== rule.condition_value) {
      return next();
    } else {
      failedValidationMessage(res, rule, data);
    }
  }

  // Deep Nested Object check ends

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
    missingDataMessage(res, rule, data);
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
    failedValidationMessage(res, rule, data);
  } else if (
    typeof data === "object" &&
    rule.condition === "eq" &&
    rule.condition_value !== data[rule.field]
  ) {
    failedValidationMessage(res, rule, data);
  }

  if (rule.condition === "gte") {
    if (
      data[rule.field] > rule.condition_value ||
      data[rule.field] === rule.condition_value
    ) {
      return next();
    }
    failedValidationMessage(res, rule, data);
  }

  if (rule.condition === "gt") {
    if (data[rule.field] > rule.condition_value) {
      return next();
    }
    failedValidationMessage(res, rule, data);
  }

  if (rule.condition === "neq") {
    if (data[rule.field] !== rule.condition_value) {
      return next();
    }
    failedValidationMessage(res, rule, data);
  }

  if (
    (rule.condition === "contains" && Array.isArray(data)) ||
    typeof data === "string"
  ) {
    if (
      typeof data === "string" &&
      !data?.toLowerCase().includes(rule.field?.toLowerCase())
    ) {
      missingDataMessage(res, rule, data);
    }
    if (
      Array.isArray(data) &&
      !data.includes(rule.condition_value, rule.field)
    ) {
      missingDataMessage(res, rule, data);
    }
  }

  next();
};
