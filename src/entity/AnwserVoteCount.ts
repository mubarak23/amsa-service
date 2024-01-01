// AnswerVoteCountColumns 
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import TableColumns, { AnswerColumns, AnswerVoteCountColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
import { utcNow } from "../utils/core";
import { Answer } from "./Answer";
import DefualtEntity from "./BaseEntity";
import { Question } from "./Question";
import { User } from "./User";

@Entity({ name: Tables.ANSWERS_VOTE_COUNTS })
export class AnswerVoteCount extends DefualtEntity {
  @Column({ name: AnswerVoteCountColumns.UUID, unique: true })
  uuid: string;

  @Column({ type: 'integer' ,name: AnswerVoteCountColumns.QUESTION_ID, nullable: false })
  questionId: number;

  @ManyToOne(() => Question, { primary: true })
  @JoinColumn({
    name: AnswerVoteCountColumns.QUESTION_ID,
    referencedColumnName: TableColumns.ID,
  })
  question: Question;

  @Column({ type: 'integer' ,name: AnswerVoteCountColumns.ANSWER_ID, nullable: false })
  anwserId: number;

  @ManyToOne(() => Answer, { primary: true })
  @JoinColumn({
    name: AnswerVoteCountColumns.ANSWER_ID,
    referencedColumnName: TableColumns.ID,
  })
  anwser: Answer;

  @Column({ name: AnswerVoteCountColumns.USER_ID, nullable: true })
  userId: number;

  @ManyToOne(() => User, { primary: true })
  @JoinColumn({
    name: AnswerColumns.USER_ID,
    referencedColumnName: TableColumns.ID,
  })
  author: User;

  @Column({ type: "integer", name: AnswerVoteCountColumns.VOTE_COUNTS, nullable: true, default: 0 })
  voteCounts: number;

  initializeNewAnwserVoteCount(userId: number, questionId: number, anwserId: number) {
    this.uuid = uuidv4();
    this.questionId = questionId;
    this.anwserId = anwserId;
    this.userId = userId;
    this.voteCounts = 1;
    this.createdAt =  utcNow();
    return this;
  }

}
