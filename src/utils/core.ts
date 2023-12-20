import Joi from 'joi'
import moment from 'moment'
import * as _ from 'underscore'
import _normalizeEmail from 'normalize-email';
import validator from 'validator';
import { AxiosError } from 'axios'
import bcrypt from "bcrypt";
import { BadRequestError } from './error-response-types'
import { FileCloudProviders } from '../enums/FileUpload';



export function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
	return typeof obj === "undefined" || obj === null
}

export const userDefaultAvatarCloudFile = () => {
  return {
    keyFromCloudProvider: '',
    url: 'https://res.cloudinary.com/trade-grid/image/upload/v1618526995/default_profile_pic_pwfk1s.png',
    mimetype: 'image/png',
    fileCloudProvider: FileCloudProviders.CLOUDINARY,
  }
}

export const validateAJoi = (joiSchema: Joi.AnySchema, object: any): boolean => {
  const validationResults = joiSchema.validate(object, {
    abortEarly: false, 
    allowUnknown: true
  })

  if (!validationResults.error) {
    return false
  } 
    throw new BadRequestError(validationResults.error.message)
  
}

export const normalizeEmail = (email: string) => {
  return _normalizeEmail(email).trim().toLowerCase();
}

export const isValidEmail = (email: string) => {
  return validator.isEmail(email);
}


export const utcNow = () => {
  return moment.utc().toDate()
}

export const standardizeDateTime = (dateTime: string) => {
  return moment.utc(dateTime).toDate()
}

function rand(min: number, max: number) {
  const random = Math.random()
  return Math.floor(random * (max - min) + min)
}

export const pickWithRoundRobin = (lastIndex: number, candidateIds: any[]) => {
  if(lastIndex === -1 || lastIndex === candidateIds.length - 1) {
    return candidateIds[0]
  }
  return candidateIds[lastIndex + 1]
}

export const getOrderEntityReferenceNumber = (entity: {id: number}) => {
  return `${10000 + entity.id}`
}


export const handleAxiosRequestError = (error: AxiosError) => {
  if (error.response) {
    /*
    * The request was made and the server responded with a
    * status code that falls out of the range of 2xx
    */
    return error.response.data.error
  } if (error.request) {
    /*
    * The request was made but no response was received, `error.request`
    * is an instance of XMLHttpRequest in the browser and an instance
    * of http.ClientRequest in Node.js
    */
    const errorMessage = 'The server seems down at the moment. Please try again later.'
    return errorMessage
  } 
    // Something happened in setting up the request and triggered an Error
    return error.message
  
}

export const generatePasswordHash = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const passwordSalt = await bcrypt.genSalt(saltRounds);
  
  return bcrypt.hash(password, passwordSalt);
}



// export const userDefaultAvatarCloudFile = () => {
//   return {
//     keyFromCloudProvider: '',
//     url: 'https://res.cloudinary.com/trade-grid/image/upload/v1618526995/default_profile_pic_pwfk1s.png',
//     mimetype: 'image/png',
//     fileCloudProvider: FileCloudProviders.CLOUDINARY,
//     fileCategory: UploadFileCategory.USER_PHOTO,
//   }
// }
