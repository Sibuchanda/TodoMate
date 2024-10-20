import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt; // Ensure cookie-parser is set up in app.js

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token found' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Attach the user to the request object
    req.user = await User.findById(decoded.userId);

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized, user not found' });
    }

    next();
  } catch (err) {
    // Clear the cookie if the token is invalid or expired
    res.clearCookie('jwt');
    return res.status(401).json({ message: 'Unauthorized, invalid token' });
  }
};
