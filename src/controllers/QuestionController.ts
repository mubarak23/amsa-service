import { Body, Get, Post, Request, Route, Security, Tags } from "tsoa"
import { getFreshConnection } from "../db"
import { NewQuestionDto } from "../dto/NewQuestionDto"
import { QuestionResponseDto } from "../dto/QuestionResponseDto"
import { Question } from "../entity/Question"
import { User } from "../entity/User"
import { IServerResponse } from "../interfaces/IServerResponse"
import * as QuestionService from "../services/questionService"
import { UnprocessableEntityError } from "../utils/error-response-types"

@Route("/api/question")
@Tags("Question Service")
export class QuestionController {

@Security("jwt")
@Get('/')
public async myQuestions(@Request() req: any): Promise<IServerResponse<QuestionResponseDto[]>>{
  const currentUser: User = req.user
  const connection = await getFreshConnection()
  const QuestionRepo = connection.getRepository(Question)

    const join = {
    alias: "questions",
    leftJoinAndSelect: {
      user: "questions.author",
    },
  }

  const questions = await QuestionRepo.find({
    where: { userId: currentUser.id},
    join,
  })

  if(questions.length === 0){
    throw new UnprocessableEntityError("No Question at the Moment")
  }

    const questionsResponse = await QuestionService.transformQuestions(questions)
    const resData : IServerResponse<QuestionResponseDto[]> = {
        status: true,
        data: questionsResponse,
        message: "Question Response"
    }
    return resData
}



@Get('/all')
public async questions(@Request() req: any): Promise<IServerResponse<QuestionResponseDto[]>>{
  const connection = await getFreshConnection()
  const QuestionRepo = connection.getRepository(Question)

    const join = {
    alias: "questions",
    leftJoinAndSelect: {
      user: "questions.author",
    },
  }

  const questions = await QuestionRepo.find({
    join,
  })

  if(questions.length === 0){
    throw new UnprocessableEntityError("No Question at the Moment")
  }

    const questionsResponse = await QuestionService.transformQuestions(questions)
    const resData : IServerResponse<QuestionResponseDto[]> = {
        status: true,
        data: questionsResponse,
        message: "Question Response"
    }
    return resData
}


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

