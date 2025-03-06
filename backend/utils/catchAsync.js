const catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(
        `Error in ${fn.name || "Unknown Function"}:`,
        error.message
      ); // Dynamic logging
      console.log("Inside catchAsync error.");
      res.status(500).json({
        success: false,
        message: "Internal Server Error!",
      });
    }
  };
};

export default catchAsync;
