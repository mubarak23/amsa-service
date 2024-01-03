// AnswerVoteCountColumns 
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import TableColumns, { AnswerColumns, QuestionVoteCountColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
import { utcNow } from "../utils/core";
import DefualtEntity from "./BaseEntity";
import { Question } from "./Question";
import { User } from "./User";

@Entity({ name: Tables.QUESTION_VOTE_COUNTS })
export class QuestionVoteCount extends DefualtEntity {
  @Column({ name: QuestionVoteCountColumns.UUID, unique: true })
  uuid: string;

  @Column({ type: 'integer' ,name: QuestionVoteCountColumns.QUESTION_ID, nullable: false })
  questionId: number;

  @ManyToOne(() => Question, { primary: true })
  @JoinColumn({
    name: QuestionVoteCountColumns.QUESTION_ID,
    referencedColumnName: TableColumns.ID,
  })
  question: Question;


  @Column({ name: QuestionVoteCountColumns.USER_ID, nullable: true })
  userId: number;

  @ManyToOne(() => User, { primary: true })
  @JoinColumn({
    name: AnswerColumns.USER_ID,
    referencedColumnName: TableColumns.ID,
  })
  author: User;

  @Column({ type: "integer", name: QuestionVoteCountColumns.VOTE_COUNTS, nullable: true, default: 0 })
  voteCounts: number;

  initializeNewQuestionVoteCount(userId: number, questionId: number) {
    this.uuid = uuidv4();
    this.questionId = questionId;
    this.userId = userId;
    this.voteCounts = 1;
    this.createdAt =  utcNow();
    return this;
  }

}
