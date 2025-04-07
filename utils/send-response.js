const sendRespose = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: success,
    data: {
      data,
    },
  });
};

export default sendRespose;
