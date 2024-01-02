import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { QuestionResponseDto } from "../dto/QuestionResponseDto";

import { AnswerResponse } from "../dto/AnswerResponse";
import { IProfile } from "../dto/IProfileResponse";
import TableColumns, { QuestionColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
import { ICloudFile } from "../interfaces/ICloudFile";
import { utcNow } from "../utils/core";
import DefualtEntity from "./BaseEntity";
import { User } from "./User";

@Entity({ name: Tables.QUESTIONS })
export class Question extends DefualtEntity {
  @Column({ name: QuestionColumns.UUID, unique: true })
  uuid: string;

  @Column({ length: 255, name: QuestionColumns.TITLE, nullable: false })
  title: string;

  @Column({ name: QuestionColumns.CONTENT, nullable: false })
  content: string;

  @Column({ type: "jsonb", name: QuestionColumns.PHOTOS, nullable: true })
  photos: ICloudFile[];

  @ManyToOne(() => User, { primary: true })
  @JoinColumn({
    name: QuestionColumns.USER_ID,
    referencedColumnName: TableColumns.ID,
  })
  author: User;

  @Column({ name: QuestionColumns.USER_ID, nullable: true })
  userId: number;


  @Column({ type: "integer", name: QuestionColumns.VOTE_COUNTS, nullable: true, default: 0 })
  voteCounts: string;

  initializeNewQuestion(userId: number, title: string, content: string) {
    this.uuid = uuidv4();
    this.title = title;
    this.content = content;
    this.userId = userId;
    this.createdAt =  utcNow();
    return this;
  }
  toResponseDto(
    authorPublicProfile: IProfile,
    question: Question,
    questionResponseImages?: {url: string, mimetype: string}[],
    anwsers?: AnswerResponse[] 
  ): QuestionResponseDto {
    return {
      uuid: question.uuid,
      title: question.title,
      content: question.content,
      photos: questionResponseImages || null,
      userId: question.userId,
      answers: anwsers || null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author: authorPublicProfile,
    }
    
  }


}
