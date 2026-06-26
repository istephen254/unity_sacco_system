const jwt = require("jsonwebtoken");

//////////////////////////////////////////////////
// 🔐 VERIFY TOKEN MIDDLEWARE
//////////////////////////////////////////////////
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Check token existence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

//////////////////////////////////////////////////
// 🛡️ ROLE-BASED ACCESS CONTROL
//////////////////////////////////////////////////
function requireRole(...roles) {
  return (req, res, next) => {
    try {
      // Ensure user exists (token middleware must run first)
      if (!req.user) {
        return res.status(401).json({
          message: "Not authenticated",
        });
      }

      // Check role permission
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied. Required role(s): ${roles.join(", ")}`,
          yourRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Authorization error",
      });
    }
  };
}

module.exports = {
  verifyToken,
  requireRole,
};