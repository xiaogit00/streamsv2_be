import jwt from 'jsonwebtoken'

export const verifyGuestToken = (req: any, res: any, next: any) => {
    let token
    
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    }
    const secretKey = String(process.env.GUEST_TOKEN_SECRET)

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.body.userId = decoded.userId; // Access user type or any relevant data
        next();
    });
}