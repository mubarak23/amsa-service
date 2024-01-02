import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { AnswerResponse } from "../dto/AnswerResponse";
import { IProfile } from "../dto/IProfileResponse";

import TableColumns, { AnswerColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
import { utcNow } from "../utils/core";
import DefualtEntity from "./BaseEntity";
import { Question } from "./Question";
import { User } from "./User";

@Entity({ name: Tables.ANSWERS })
export class Answer extends DefualtEntity {
  @Column({ name: AnswerColumns.UUID, unique: true })
  uuid: string;

  @Column({ name: AnswerColumns.CONTENT, nullable: false })
  content: string;

  @Column({ type: 'integer' ,name: AnswerColumns.QUESTION_ID, nullable: false })
  questionId: number;

  @ManyToOne(() => Question, { primary: true })
  @JoinColumn({
    name: AnswerColumns.QUESTION_ID,
    referencedColumnName: TableColumns.ID,
  })
  question: Question;

  @Column({ name: AnswerColumns.USER_ID, nullable: true })
  userId: number;

  @ManyToOne(() => User, { primary: true })
  @JoinColumn({
    name: AnswerColumns.USER_ID,
    referencedColumnName: TableColumns.ID,
  })
  author: User;

  @Column({ type: "integer", name: AnswerColumns.VOTE_COUNTS, nullable: true, default: 0 })
  voteCounts: number;

  initializeNewQuestionAnwser(userId: number, questionId: number, content: string) {
    this.uuid = uuidv4();
    this.questionId = questionId;
    this.content = content;
    this.userId = userId;
    this.createdAt =  utcNow();
    return this;
  }

  toResponseDto(
    anwser: Answer,
    authorPublicProfile: IProfile,
  ): AnswerResponse {
    return {
      questionUuid: anwser.uuid,
      author: authorPublicProfile,
      content: anwser.content,
      createdAt: anwser.createdAt,
      updatedAt: anwser.updatedAt,
    }
  }



}
