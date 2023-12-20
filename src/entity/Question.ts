import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import TableColumns, { QuestionColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
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

}
