import jwt from 'jsonwebtoken'

function protect(req, res, next) {
  try {
    const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const userData = jwt.verify(token, process.env.JWTPRIVATEKEY);

    req.user = userData; // attach decoded user info

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default protect;
