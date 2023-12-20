import jwt from 'jsonwebtoken';
import { User } from "../entity/User";
import Rest from "../enums/Rest";
import { IAccessTokenData } from "../interfaces/IAccessTokenData";
import { IJwtPayload } from "../interfaces/IJwtPayload";


export const getAccessToken = async (exisitingUser: User): Promise<IAccessTokenData> => {
    const tokeForUser :IJwtPayload = {
        uuid: exisitingUser.uuid,
        userName: exisitingUser.userName,
        emailAddress: exisitingUser.emailAddress,
    }
    const jwtSecret: string = (process.env.JWT_SECRET as string) || 'rth5766d'
    console.log(jwtSecret)
    const generatedToken = jwt.sign(tokeForUser, jwtSecret, {
        expiresIn: Rest.JWT_TIMEOUT
    })
    const generatedRefreshToken = jwt.sign(tokeForUser, jwtSecret, {
        expiresIn: Rest.JWT_REFRESH_TIMEOUT
    })

    return {
        token: generatedToken,
        refreshToken: generatedRefreshToken
    }
}