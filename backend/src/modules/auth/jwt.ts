import { JWTPayload } from "../../types/auth";
import jwt from "jsonwebtoken";
export const signJWT = (payload: JWTPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "8h" });
    return token;
}
export const verifyJWT = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded as JWTPayload;
    } catch (err) {
        return null;
    }
}