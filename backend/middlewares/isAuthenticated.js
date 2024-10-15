

// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({
//         message: "User not authenticated",
//         success: false,
//       });
//     }

//     const decode = await jwt.verify(token, process.env.SECRET_KEY);
//     if (!decode) {
//       return res.status(401).json({
//         message: "Invalid token",
//         success: false,
//       });
//     }
//     req.id = decode.userId;
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default isAuthenticated;

import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("bearer ")) {
    return res.status(401).json({
      message: "User not authenticated",
      success: false,
    });
  }
  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer "
  if(token){
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      
      if (!decode) {
        return res.status(401).json({
          message: "Invalid token",
          success: false,
        });
      }
      
      req.id = decode.userId; // Add the user ID to the request object
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  } 
  else{
    return res.status(401).json({
      message:"Token Not found",
      success:false
    });
  }
};

export default isAuthenticated;
