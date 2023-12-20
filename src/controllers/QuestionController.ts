import { Body, Post, Request, Route, Security, Tags } from "tsoa"
import { NewQuestionDto } from "../dto/NewQuestionDto"
import { QuestionResponseDto } from "../dto/QuestionResponseDto"
import { User } from "../entity/User"
import { IServerResponse } from "../interfaces/IServerResponse"
import * as QuestionService from "../services/questionService"

@Route("/api/question")
@Tags("Question Service")
export class QuestionController {

  @Security("jwt")
  @Post('/add')
  public async addQuestion(@Request() req: any, @Body() reqBody: NewQuestionDto ): Promise<IServerResponse<QuestionResponseDto>> {
    const currentUser: User = req.user
    const questionResponse = await QuestionService.addQuestion(reqBody, currentUser)

    const resData: IServerResponse<QuestionResponseDto> = {
      status: true,
      data: questionResponse
    }
    return resData

}


}

