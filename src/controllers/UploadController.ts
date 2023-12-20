// /* eslint-disable class-methods-use-this */
// import { Path, Route, Tags, Security, Request, Put, UploadedFile, Controller, Query } from "tsoa";
// import { v4 as uuidv4 } from "uuid";
// import fs from 'fs'
// import { promises as fsAsync } from 'fs';

// import path from 'path'
// import os from 'os'

// import { IServerResponse } from "../interfaces/IServerResponse";
// import { BadRequestError } from "../utils/error-response-types";
// import * as FileUploadService from "../services/fileUploadService";
// import { FileData, UploadFileCategory } from "../enums/FileUpload";
// import { User } from "../entity/User";

// // DO NOT EXPORT DEFAULT

// @Route("api/upload")
// @Tags('Upload')
// @Security('jwt')
// export class UploadController extends Controller {

//   @Put('')
//   public async handleFileUpload(@Request() req: any,
//       @UploadedFile('file') file: Express.Multer.File,
//       @Query('fileUploadCategory') fileUploadCategory: UploadFileCategory,
//       @Query('entityUuid') entityUuid: string,
//     ): Promise<IServerResponse<void>> {
//     if (!file) throw new BadRequestError(`A file was not uploaded`)

//     const currentUser: User = req.user

//     const fileUploadDirectory = path.join(os.tmpdir(), "file-uploads");

//     if (!fs.existsSync(fileUploadDirectory)) {
//       fs.mkdirSync(fileUploadDirectory)
//     }
//     const randomFileName = uuidv4();

//     const uploadFilePath: string = path.join(os.tmpdir(), "file-uploads", randomFileName)

//     await fsAsync.writeFile(uploadFilePath, file.buffer);

//     const fileData: FileData = {
//       filePath: uploadFilePath,
//       mimeType: file.mimetype,
//       sizeInBytes: file.size
//     }

//     await FileUploadService.processFileUpload(currentUser, fileUploadCategory, fileData, entityUuid)

//     await fsAsync.unlink(uploadFilePath)

//     const resData: IServerResponse<void> = {
//       status: true,
//     }

//     return resData
//   }
// }
