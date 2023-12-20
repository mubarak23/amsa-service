// functions
// create a question
// transform questions
// transform single question
// fetch my questions
// edit my questions
// delete question 

import { getFreshConnection } from "../db";
import { NewQuestionDto } from "../dto/NewQuestionDto";
import { QuestionResponseDto } from "../dto/QuestionResponseDto";
import { Question } from "../entity/Question";
import { User } from "../entity/User";
import * as profileService from './profileService';


export const addQuestion = async (payload: NewQuestionDto, user: User) : Promise<QuestionResponseDto> => {
  const connection = await getFreshConnection()
  const QuestionRepo = connection.getRepository(Question)

  const question = await QuestionRepo.findOne({
    where: { title: payload.title, userId: user.id}
  })
  const author = await profileService.authorPublicProfile(user);

  if(question){
    // update record with content and return 
    await QuestionRepo.createQueryBuilder()
    .update(Question)
    .set({
      content: payload.content
    })
    .where({
      id: question.id
    })
    .execute()

    const questionResponse: QuestionResponseDto = {
      uuid: question.uuid,
      title: question.title,
      content: payload.content,
      photos: question.photos,
      userId: question.userId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author,
    }
    return questionResponse;
  }
  // 
  const newQuestion = new Question().initializeNewQuestion(user.id, payload.title, payload.content)
  const saveQuestion = await QuestionRepo.save(newQuestion)

  const questionResponse: QuestionResponseDto = {
    uuid: saveQuestion.uuid,
    title: saveQuestion.title,
    content: payload.content,
    photos: saveQuestion.photos,
    userId: saveQuestion.userId,
    createdAt: saveQuestion.createdAt,
    updatedAt: saveQuestion.updatedAt,
    author,
  }
  return questionResponse;
 
}