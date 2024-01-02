import { IProfile } from "./IProfileResponse";

export interface AnswerResponse {
  questionUuid: string, 
  author: IProfile,
  content: string,
  createdAt: Date,
  updatedAt: Date,

}