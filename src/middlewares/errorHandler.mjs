const errorHandler = (err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: 'Erreur interne du serveur' });
};

export default errorHandler;
