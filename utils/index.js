export const failedValidationMessage = (res, rule, data) => {
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
};

export const missingDataMessage = (res, rule, data) => {
  return res.status(400).json({
    message: `field ${rule.field} is missing from data.`,
    status: "error",
    data: null,
  });
};
