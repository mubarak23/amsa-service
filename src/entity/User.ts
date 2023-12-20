import { Column, Entity } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Roles } from "../enums/Roles";
import { UserColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
import { ICloudFile } from "../interfaces/ICloudFile";
import { utcNow } from "../utils/core";
import DefualtEntity from "./BaseEntity";

@Entity({ name: Tables.USERS })
export class User extends DefualtEntity {
  @Column({ name: UserColumns.UUID, unique: true })
  uuid: string;

  @Column({ length: 255, name: UserColumns.USER_NAME, nullable: false })
  userName: string;

  @Column({ length: 255, name: UserColumns.BIO, nullable: true })
  bio: string;

  @Column({ name: UserColumns.EMAIL_ADDRESS, nullable: true })
  emailAddress: string;


  @Column({ name: UserColumns.PASSWORD_HASH, nullable: false })
  passwordHash: string;

  @Column({ type: "jsonb", name: UserColumns.PHOTO, nullable: true })
  photo: ICloudFile;

  @Column({ name: UserColumns.ROLE, nullable: false, default: Roles.NORMAL_USER })
  role!: string;


  initialize(userName: string, emailAddress: string, passwordHash: string) {
    this.uuid = uuidv4();
    this.userName = userName;
    this.emailAddress = emailAddress;
    this.passwordHash = passwordHash;
    this.createdAt =  utcNow();
    return this;
  }

}
