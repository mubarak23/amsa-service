// handle prpfile update
// fetch user all Questions Asks
// fetch all user followers and followings

import { Body, Post, Request, Route, Security, Tags } from "tsoa";
import { IProfile } from "../dto/IProfileResponse";
import { UpdateUserBioDto } from "../dto/UpdateUserBioDto";
import { User } from "../entity/User";
import { IServerResponse } from "../interfaces/IServerResponse";
import * as ProfileService from '../services/profileService';


@Route("/api/user")
@Tags("User Service")
export class UserController {

@Security("jwt")
@Post("/bio")
public async updateUserBio(@Request() req: any, @Body() reqBody: UpdateUserBioDto) : Promise<IServerResponse<IProfile>>{
    const currentUser: User = req.user;
    const profile = await ProfileService.updateProfileBio(currentUser, reqBody.bio);

    const resData : IServerResponse<IProfile> = {
        status: true,
        data: profile,
        message: "User Account Bio Updated"
    }
    return resData

  }

}