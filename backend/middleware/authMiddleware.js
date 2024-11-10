import jwt from 'jsonwebtoken';

// Middleware to protect routes
export const protect = (req, res, next) => {
  const token = req.cookies.auth_token;  // Get the token from cookies

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach the decoded user info to the request object
    next();  // Continue to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

