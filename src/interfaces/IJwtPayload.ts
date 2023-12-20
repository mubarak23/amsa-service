import { ICloudFile } from "../interfaces/ICloudFile";
export interface IJwtPayload {
  uuid: string,
  userName?: string,
  emailAddress?: string,
  photo?: ICloudFile,
}
