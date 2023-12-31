import { IProfile } from "./IProfileResponse";

export interface AnswerResponse {
  questionUuid: string, 
  content: string,
  author: IProfile
}