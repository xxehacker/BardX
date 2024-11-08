import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId,res) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "15d"
    })
    res.cookie('jwt', token, {
        maxAge: 15*24*60*60*1000,
        httpOnly: true, // prevents client-side JavaScript from accessing the cookie (no cross-site scripting attacks)
        sameSite: 'none', // prevents cookie from being sent to different domains(no cookie theft)
        secure: process.env.NODE_ENV !== 'development', // only transmit cookie over https
    })
}
