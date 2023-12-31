

import { getFreshConnection } from "../db";
import { AnswerResponse } from "../dto/AnswerResponse";
import { NewQuestionAnswerDto } from "../dto/NewQuestionAnswerDto";
import { QuestionResponseDto } from "../dto/QuestionResponseDto";
import { Answer } from "../entity/Answer";
import { Question } from "../entity/Question";
import { User } from "../entity/User";
import { UnprocessableEntityError } from "../utils/error-response-types";
import * as profileService from './profileService';

export const answerQuestion = async (payload: NewQuestionAnswerDto, user: User) : Promise<QuestionResponseDto> => {
  const connection = await getFreshConnection()
  const AnwserRepo = connection.getRepository(Answer)
  const QuestionRepo = connection.getRepository(Question)

  const join = {
    alias: "questions",
    leftJoinAndSelect: {
      user: "questions.author",
    },
  }
  const questionExist = await QuestionRepo.findOne({
    where: { uuid: payload.questionUuid},
    join
  })

  if(!questionExist){
    throw new UnprocessableEntityError('Question Does Not Exist')
  }

  if(questionExist.userId === user.id){
    throw new UnprocessableEntityError('Cannot Provide an Anwser to Your Question')
  }
  const questionAuthor = await profileService.authorPublicProfile(questionExist.author);
  const newQuestionAnwser = new Answer().initializeNewQuestionAnwser(user.id, questionExist.id, payload.content)
  const saveQuestionAnwser = await AnwserRepo.save(newQuestionAnwser)

  const authorAnwser = await profileService.authorPublicProfile(user);

  const answerResponse: AnswerResponse = {
    questionUuid: questionExist.uuid,
    content: saveQuestionAnwser.content,
    author: authorAnwser
  }
  const answerResponses : AnswerResponse[] = []
  answerResponses.push(answerResponse);

  const questionWithAnwserResponse: QuestionResponseDto = {
    uuid: questionExist.uuid,
    title: questionExist.title,
    content: questionExist.content,
    photos: questionExist.photos,
    userId: questionExist.userId,
    createdAt: questionExist.createdAt,
    updatedAt: questionExist.updatedAt,
    answers: answerResponses,
    author: questionAuthor,
  }
  return questionWithAnwserResponse;

}
