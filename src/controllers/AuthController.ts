import bcrypt from "bcrypt";
import { Body, Post, Route, Tags } from "tsoa";
import { getFreshConnection } from "../db";
import { ILoginDto } from "../dto/ILoginDto";
import { ISignupDto } from "../dto/ISignupDto";
import { User } from "../entity/User";
import { IAccessTokenData } from "../interfaces/IAccessTokenData";
import { IServerResponse } from "../interfaces/IServerResponse";
import * as TokenService from "../services/tokenService";
import * as Utils from "../utils/core";
import { BadRequestError, UnauthorizedRequestError } from "../utils/error-response-types";


@Route("/api/auth")
@Tags("Auth Service")
export class AuthController {

@Post("/agent/signup")
public async agentSignup(@Body() reqBody: ISignupDto) : Promise<IServerResponse<IAccessTokenData>>{
    const connection = await getFreshConnection()
    const userRepo = connection.getRepository(User)
    const exitingUser = await userRepo.findOne({ emailAddress: reqBody.emailAddress })

    if(exitingUser){
    throw new BadRequestError("The Email Address has been used")
    }

    const userWithUsername = await userRepo.findOne({ userName: reqBody.userName })

    if(userWithUsername){
        throw new BadRequestError("The UserName has been used")
        }

        
    const passwordHash = await Utils.generatePasswordHash(reqBody.password)
    const newUser = new User().initialize(
        reqBody.userName,  reqBody.emailAddress, passwordHash
    )
    const saveUser = await userRepo.save(newUser)

    const signUpToken = await TokenService.getAccessToken(saveUser)
    const resData : IServerResponse<IAccessTokenData> = {
        status: true,
        data: signUpToken,
        message: "User Account Created Successfully"
    }
    return resData

}

@Post("/agent/signin")
public async agentSignin(@Body() reqBody: ILoginDto) : Promise<IServerResponse<IAccessTokenData>>{
    const {emailAddress, password} = reqBody
    const connection = await getFreshConnection()
    const userRepo = connection.getRepository(User)
    const doesUserExist = await userRepo.findOne({ emailAddress })
    if(!doesUserExist){
        throw new BadRequestError('Invalid Login credentials')
    }
    const match = await bcrypt.compare(password, doesUserExist.passwordHash);
    if (!match) {
      throw new UnauthorizedRequestError("User credentials are wrong.");
    }

    const signinToken = await TokenService.getAccessToken(doesUserExist)
    const resData : IServerResponse<IAccessTokenData> = {
        status: true,
        data:signinToken,
        message: 'Login Successfully' 
    }
    return resData

}

}