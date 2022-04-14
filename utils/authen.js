const isAuthor = async (id) => {
  const { userId } = req.payload;
  if (userId !== id) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
    });
  }
};

module.exports = { isAuthor };
