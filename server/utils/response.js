export const successResponse = (res, message, data = {}, code = 200) => {
  return res.status(code).json({
    success: true,
    error: false,
    message,
    data,
  });
};

export const errorResponse = (res, message, code = 500, errors = null) => {
  return res.status(code).json({
    success: false,
    error: true,
    message,
    ...(errors && { errors }), // only include if provided
  });
};

