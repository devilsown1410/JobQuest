import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    console.error('Token verification error:', ex);
    res.status(400).send('Invalid token.');
  }
};
export default auth;
