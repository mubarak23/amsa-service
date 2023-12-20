import { User } from "../entity/User"
import { getFreshConnection } from "../db"
import { IServerResponse } from "../interfaces/IServerResponse";
import { Put, Request, Route, Security, Body, Post, Tags, Get } from "tsoa";
import * as Utils from "../utils/core"
import * as ProfileService from "../services/profileService";
import { IAccessTokenData } from "../interfaces/IAccessTokenData";
import { BadRequestError, UnauthorizedRequestError } from "../utils/error-response-types";
import { IProfile } from "../dto/IProfileResponse";

@Route("/api/agent")
@Tags("Agent Service")
@Security("jwt")
export class AgentController {

    @Get('/profile')
    public async agentProfile(@Request() req: any): Promise<IServerResponse<IProfile>>{
        const currentUser: User = req.user
        const agentProfile = await ProfileService.agentPublicProfile(currentUser)
        const resData : IServerResponse<IProfile> = {
            status: true,
            data: agentProfile,
            message: "Agent Profile"
        }
        return resData

    }


}