import jwt from "jsonwebtoken";

export async function authUser(req, res, next) {
  try {
   const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]

    console.log("Your token is",token);
    
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized user, Please login to proceed further",
        success: false,
        error: true,
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    
    

    if (!decodedToken) {
      return res.status(401).json({
        message: "unauthorized access",
        error: true,
        success: false,
      });
    }

    req.userId = decodedToken.userId;
      
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
      error: true,
    });
  }
}
