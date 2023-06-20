import { sign, verify } from "jsonwebtoken";
import DotenvComponent from "./DotenvComponent";
export default class JWtComponent {

    public static generateToken(user:any, expires: string = "24h", jwtKey:string = DotenvComponent.API_JWT_KEY): string {

        const data = {
            _id: user._id,
            name: user.name,
            type: user.type
        };

        return sign(data, jwtKey,{expiresIn: expires});
    }

    public static async decodeToken(token: string, jwtKey:string = DotenvComponent.API_JWT_KEY): Promise<any> {
        try {
            return await verify(token, jwtKey);
        } catch (error) {
            return undefined;
        }
    }


}