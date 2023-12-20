import { ICloudFile } from "../interfaces/ICloudFile";

export interface IProfile {
  userUuid: string,
  userName: string,
  emailAddress: string,
  photo: ICloudFile,
}
