import { IProfile } from "./IProfileResponse";

// QuestionResponseDto
export interface QuestionResponseDto {
  uuid: string,
  title: string,
  content: string,
  photos?: {
    url: string,
    mimetype: string,
  }[],
  userId: number,
  author: IProfile,
  createdAt: Date,
  updatedAt: Date,
}