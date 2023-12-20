import { In } from "typeorm";
import { getFreshConnection } from "../db";
import { IProfile } from "../dto/IProfileResponse";
import { User } from "../entity/User";


export const agentPublicProfile = async (currentUser: User): Promise<IProfile> => {
    const connection = await getFreshConnection()
    const userRepo = connection.getRepository(User)
    const userDetails = await userRepo.findOne({ uuid: currentUser.uuid})
    const resProfile: IProfile =  {
        userUuid: currentUser.uuid,
        userName: userDetails.userName,
        emailAddress: userDetails.emailAddress,
        photo: userDetails.photo
    }
    return resProfile
}

export const authorPublicProfile = async (currentUser: User): Promise<IProfile> => {
  const resProfile: IProfile =  {
      userUuid: currentUser.uuid,
      userName: currentUser.userName,
      emailAddress: currentUser.emailAddress,
      photo: currentUser.photo
  }
  return resProfile
}


export const getPublicProfileFromUserIds = async (userIds: number[]): Promise<IProfile[]> => {
    if (!userIds.length) {
      return []
    }
  
    const connection = await getFreshConnection()
  
    const userRepo = connection.getRepository(User)
    const users = await userRepo.find({
      id: In(userIds),
    })
    if (!users.length) {
      return []
    }
  
    
    const profilesData: IProfile[] = []
    
    for(const user of users) {
      const userData = users.find(u => u.id === user.id)
      if(!userData) {
        continue
      }
  
      profilesData.push({
        userUuid: userData.uuid,
        emailAddress: userData.emailAddress,
        userName: userData.userName,
        photo: userData.photo
        
      })
    }
  
    return profilesData
  }
