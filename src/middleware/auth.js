const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(401).json({ status: false, errorCode: 'Unauthorized', message: 'Authentication token is required to access this resource' });
  }
  const token = req.headers["authorization"].replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ status: false, errorCode: 'Unauthorized', message: 'Authentication token is required to access this resource' });
  }
  const secretKey = process.env.SECRET_KEY ?? "CAPERMINT SECRET";
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.body._id = decoded.id;
    next();
  });
};




