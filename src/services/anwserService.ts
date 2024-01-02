

import { getFreshConnection } from "../db";
import { AnswerResponse } from "../dto/AnswerResponse";
import { IProfile } from "../dto/IProfileResponse";
import { NewQuestionAnswerDto } from "../dto/NewQuestionAnswerDto";
import { QuestionResponseDto } from "../dto/QuestionResponseDto";
import { VoteAnwserDto } from "../dto/VoteAnwserDto";
import { Answer } from "../entity/Answer";
import { AnswerVoteCount } from "../entity/AnwserVoteCount";
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

  const answerResponse: AnswerResponse = await transformQuestionAnwser(saveQuestionAnwser, authorAnwser);
  
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

export const transformQuestionAnwser = async ( anwser: Answer, authorAnwser: IProfile): Promise<AnswerResponse> => {
  const transformQuestionAnwser = anwser.toResponseDto(anwser, authorAnwser)
  return transformQuestionAnwser;
}

export const voteAnswerQuestion = async (payload: VoteAnwserDto, user: User) : Promise<QuestionResponseDto> => {
  const connection = await getFreshConnection()
  const AnwserRepo = connection.getRepository(Answer)
  const QuestionRepo = connection.getRepository(Question)
  const AnswerVoteCountRepo = connection.getRepository(AnswerVoteCount)
  const join = {
    alias: "questions",
    leftJoinAndSelect: {
      user: "questions.author",
    },
  }

  const joinAnwser = {
    alias: "anwsers",
    leftJoinAndSelect: {
      user: "anwsers.author",
    },
  }

  const questionExist = await QuestionRepo.findOne({
    where: { uuid: payload.questionUuid},
    join
  })

  if(!questionExist){
    throw new UnprocessableEntityError('Question Does Not Exist')
  }

  const answerExist = await AnwserRepo.findOne({
    where: { uuid: payload.answerUuid, questionId: questionExist.id},
    join: joinAnwser
  })

  if(!answerExist){
    throw new UnprocessableEntityError("Answer to the Question Does Not Exist")
  }
   // CANNOT VOTE YOUR ANSWER
  if(answerExist.userId === user.id){
    throw new UnprocessableEntityError("Cannot Vote Your Anwser")
  }
  
  // check the user has voted the anwer
  const anwserVoteCount = await AnswerVoteCountRepo.findOne({
    where: { userId: user.id, anwserId: answerExist.id}
  })

  const authorAnwser = await profileService.authorPublicProfile(answerExist.author);
    const questionAuthor = await profileService.authorPublicProfile(questionExist.author);
  
    if(anwserVoteCount){

    // update the count
    AnswerVoteCountRepo
    .createQueryBuilder()
    .update(AnswerVoteCount)
    .set({ 
      voteCounts: anwserVoteCount.voteCounts + 1,
      })
    .where({
      uuid: anwserVoteCount.id,
    })
    .execute();
    
    const answerResponse: AnswerResponse = await transformQuestionAnwser(answerExist, authorAnwser);
    
    //  = {
    //   questionUuid: questionExist.uuid,
    //   content: answerExist.content,
    //   author: authorAnwser
    // }

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

  // save the count for the first one
  const newAnwserVoteCount = new AnswerVoteCount().initializeNewAnwserVoteCount(user.id, questionExist.id, answerExist.id)
  await AnwserRepo.save(newAnwserVoteCount)

  // const answerResponse: AnswerResponse = {
  //   questionUuid: questionExist.uuid,
  //   content: answerExist.content,
  //   author: authorAnwser
  // }

  const answerResponse: AnswerResponse = await transformQuestionAnwser(answerExist, authorAnwser);
  
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

// AnswerVoteCount