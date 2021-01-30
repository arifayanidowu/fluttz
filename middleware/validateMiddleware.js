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
      return res.status(400).json({
        message: `field ${rule.field} is missing from data.`,
        status: "error",
        data: null,
      });
    } else if (data[arr[0]][arr[1]] !== rule.condition_value) {
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
    } else {
      return next();
    }
  }

  // Deep nested :gt:
  if (rule.condition === "gt" && rule?.field?.includes(".")) {
    let arr = rule?.field?.split(".");

    if (!data[arr[0]].hasOwnProperty(arr[1])) {
      return res.status(400).json({
        message: `field ${rule.field} is missing from data.`,
        status: "error",
        data: null,
      });
    } else if (data[arr[0]][arr[1]] > rule.condition_value) {
      return next();
    } else {
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
  }

  // Deep nested :gte:
  if (rule.condition === "gte" && rule?.field?.includes(".")) {
    let arr = rule?.field?.split(".");

    if (!data[arr[0]].hasOwnProperty(arr[1])) {
      return res.status(400).json({
        message: `field ${rule.field} is missing from data.`,
        status: "error",
        data: null,
      });
    } else if (
      data[arr[0]][arr[1]] > rule.condition_value ||
      data[arr[0]][arr[1]] === rule.condition_value
    ) {
      return next();
    } else {
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
  }

  // Deep nested :neq:
  if (rule.condition === "neq" && rule?.field?.includes(".")) {
    let arr = rule?.field?.split(".");

    if (!data[arr[0]].hasOwnProperty(arr[1])) {
      return res.status(400).json({
        message: `field ${rule.field} is missing from data.`,
        status: "error",
        data: null,
      });
    } else if (data[arr[0]][arr[1]] !== rule.condition_value) {
      return next();
    } else {
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
    rule.condition_value !== data[rule.field]
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

  if (
    (rule.condition === "contains" && Array.isArray(data)) ||
    typeof data === "string"
  ) {
    if (
      typeof data === "string" &&
      !data?.toLowerCase().includes(rule.field?.toLowerCase())
    ) {
      return res.status(400).json({
        message: `field ${rule.field} is missing from data.`,
        status: "error",
        data: null,
      });
    }
    if (
      Array.isArray(data) &&
      !data.includes(rule.condition_value, rule.field)
    ) {
      return res.status(400).json({
        message: `field ${rule.field} is missing from data.`,
        status: "error",
        data: null,
      });
    }
  }

  next();
};
