// functions
// create a question
// transform questions
// transform single question
// fetch my questions
// edit my questions
// delete question 
import * as _ from 'underscore';
import { getFreshConnection } from "../db";
import { AnswerResponse } from '../dto/AnswerResponse';
import { NewQuestionDto } from "../dto/NewQuestionDto";
import { QuestionResponseDto } from "../dto/QuestionResponseDto";
import { Answer } from '../entity/Answer';
import { AnswerVoteCount } from '../entity/AnwserVoteCount';
import { Question } from "../entity/Question";
import { QuestionVoteCount } from '../entity/QuestionVoteCount';
import { User } from "../entity/User";
import { UnprocessableEntityError } from '../utils/error-response-types';
import * as AnwserService from './anwserService';
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

export const questionAnwsers = async (questionUuid: string): Promise<QuestionResponseDto> => {
  const connection = await getFreshConnection()
  const QuestionRepo = connection.getRepository(Question)
  const AnwserRepo = connection.getRepository(Answer)
  const join = {
    alias: "questions",
    leftJoinAndSelect: {
      user: "questions.author",
    },
  }

  const questionExist = await QuestionRepo.findOne({
    where: { uuid: questionUuid},
    join
  })

  if(!questionExist){
    throw new UnprocessableEntityError('Question Does Not Exist');
  }

  const joinAnwser = {
    alias: "anwsers",
    leftJoinAndSelect: {
      user: "anwsers.author",
    },
  }

  const questionAnwsers = await AnwserRepo.find({
    where: { questionId: questionExist.id},
    join: joinAnwser
  })

  if(questionAnwsers){
    const transformQuestionAnAnwsers = await transformQuestion(questionExist, questionAnwsers);

    return transformQuestionAnAnwsers
  }

  const transformQuestionAnAnwsers = await transformQuestion(questionExist);

  return transformQuestionAnAnwsers

}

export const transformQuestion = async (question: Question, questionAnwsers?: Answer[]) : Promise<QuestionResponseDto> => {
  // AnswerResponse
  const questionAuthorProfile = await profileService.agentPublicProfile(question.author)
  const questionImages = question.photos || []
  const questionResponseImages: {url: string, mimetype: string, keyFromCloudProvider: string }[] = 
  questionImages.map(pImage => _.omit(pImage, 'fileCloudProvider'))

  if(questionAnwsers){

    const answerResponses : AnswerResponse[] = []

    for ( const answer of questionAnwsers){
      const authorAnwser = await profileService.authorPublicProfile(answer.author);

      const answerResponse: AnswerResponse = await AnwserService.transformQuestionAnwser(answer, authorAnwser);
      answerResponses.push(answerResponse);

    }

    const transFormQuestion = question.toResponseDto(questionAuthorProfile, question, questionResponseImages, answerResponses)
    
    return transFormQuestion

  }

  const transFormQuestion = question.toResponseDto(questionAuthorProfile, question, questionResponseImages)
    
return transFormQuestion
}



export const transformQuestions = async (questions: Question[]) : Promise<QuestionResponseDto[]> => {

  const authorUserIds = questions.map((question) => question.userId);


  const developerPublicProfiles = await profileService.getPublicProfileFromUserIds(authorUserIds);
  const questionResponse: QuestionResponseDto[] = []

  for(const question of questions) {
    
    const authorPublicProfile = developerPublicProfiles.find(
      (publicProfile) => publicProfile.userUuid === question.author.uuid
    );

    const questionImages = question?.photos || []
    const projectResponseImages: {url: string, mimetype: string, keyFromCloudProvider: string }[] = 
    questionImages.map(pImage => _.omit(pImage, 'fileCloudProvider'))


    const oneQuestionResponse: QuestionResponseDto = question.toResponseDto(
      authorPublicProfile!,
      question,
      questionImages
    )
    questionResponse.push(oneQuestionResponse)
  }

  return questionResponse;

}


export const voteAnswerQuestion = async (questionUuid: string, user: User) : Promise<QuestionResponseDto> => {
  const connection = await getFreshConnection()
  const AnwserRepo = connection.getRepository(Answer)
  const QuestionRepo = connection.getRepository(Question)
  const AnswerVoteCountRepo = connection.getRepository(AnswerVoteCount)
  const QuestionVoteCountRepo = connection.getRepository(QuestionVoteCount)

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
    where: { uuid: questionUuid},
    join
  })

  if(!questionExist){
    throw new UnprocessableEntityError('Question Does Not Exist')
  }

    // CANNOT VOTE YOUR ANSWER
    if(questionExist.userId === user.id){
      throw new UnprocessableEntityError("Cannot Vote Your Question")
    }

  const answerExist = await AnwserRepo.find({
    where: { questionId: questionExist.id},
    join: joinAnwser
  })

  if(!answerExist){
    throw new UnprocessableEntityError("Answer to the Question Does Not Exist")
  }
 
  
  // check the user has voted the Question
  const questionVoteCount = await QuestionVoteCountRepo.findOne({
    where: { userId: user.id, questionId: questionExist.id}
  })

 //  const authorAnwser = await profileService.authorPublicProfile(answerExist.author);
    const questionAuthor = await profileService.authorPublicProfile(questionExist.author);
  
    if(questionVoteCount){

    // update the count
    QuestionVoteCountRepo
    .createQueryBuilder()
    .update(QuestionVoteCount)
    .set({ 
      voteCounts: questionVoteCount.voteCounts + 1,
      })
    .where({
      uuid: questionVoteCount.id,
    })
    .execute();
    
    const questionWithAnwserResponse: QuestionResponseDto = {
      uuid: questionExist.uuid,
      title: questionExist.title,
      content: questionExist.content,
      photos: questionExist.photos,
      userId: questionExist.userId,
      createdAt: questionExist.createdAt,
      updatedAt: questionExist.updatedAt,
      author: questionAuthor,
    }
    return questionWithAnwserResponse;

  }
  // save the count for the first one
  const newQuestionVoteCount = new QuestionVoteCount().initializeNewQuestionVoteCount(user.id, questionExist.id)
  await AnswerVoteCountRepo.save(newQuestionVoteCount)

  const questionResponse: QuestionResponseDto = {
    uuid: questionExist.uuid,
    title: questionExist.title,
    content: questionExist.content,
    photos: questionExist.photos,
    userId: questionExist.userId,
    createdAt: questionExist.createdAt,
    updatedAt: questionExist.updatedAt,
    author: questionAuthor,
  }
  return questionResponse;

}
