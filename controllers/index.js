export const homeRoute = (req, res, next) => {
  const data = {
    name: "Arifayan Idowu",
    github: "@stizzle123",
    email: "arifayanidowu@gmail.com",
    mobile: "08127595101",
    twitter: "@arifayanidowu",
  };
  res.status(200).send({
    message: "Validation Successful",
    status: "success",
    data,
  });
  next();
};

export const validateRoute = (req, res) => {
  const { data, rule } = req.body;

  res.status(200).json({
    message: `field ${rule.field} successfully validated.`,
    status: "success",
    data: {
      validation: {
        error: false,
        field: rule.field,
        field_value: data[rule.field],
        condition: rule.condition,
        condition_value: rule.condition_value,
      },
    },
  });
};
