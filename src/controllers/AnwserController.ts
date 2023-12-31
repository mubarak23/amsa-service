import { Body, Post, Request, Route, Security, Tags } from "tsoa";
import { NewQuestionAnswerDto } from "../dto/NewQuestionAnswerDto";
import { QuestionResponseDto } from "../dto/QuestionResponseDto";
import { User } from "../entity/User";
import { IServerResponse } from "../interfaces/IServerResponse";
import * as AnwserService from "../services/anwserService";



@Route("/api/anwser")
@Tags("Anwser Service")
export class AnwserController {

@Security("jwt")
@Post('/')
public async anwserQuestion(@Request() req: any, @Body() reqBody: NewQuestionAnswerDto ): Promise<IServerResponse<QuestionResponseDto>> {

  const currentUser: User = req.user
  const questionAnwserResponse = await AnwserService.answerQuestion(reqBody, currentUser)

  const resData: IServerResponse<QuestionResponseDto> = {
    status: true,
    data: questionAnwserResponse
  }
  return resData

}

}