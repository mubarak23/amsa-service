// import moment from 'moment'
// import bcrypt from 'bcrypt'
// import { Get, Request, Route, Tags, Security, Query, Post, Body, Controller } from "tsoa"
// import { MoreThan } from 'typeorm';

// import { IServerResponse } from "../interfaces/IServerResponse";
// import { paginate } from '../services/paginationService';
// import { FinancialTransaction } from '../entity/FinancialTransaction';
// import { SortOrder } from '../enums/SortOrder';
// import { EarningsByMonth } from '../entity/EarningsByMonth';
// import { EarningsByYear } from '../entity/EarningsByYear';
// import { Wallet } from '../entity/Wallet';
// import { UnauthorizedRequestError, UnprocessableEntityError } from '../utils/error-response-types';
// import * as WalletService from "../services/walletService"
// // import * as EmailService from '../services/emailService'
// import { User } from '../entity/User';
// import { getFreshConnection } from '../db';
// import { WithdrawFundsRequestDto } from '../dto/WithdrawFundsRequestDto';
// import { PaymentTransactionStatus } from '../enums/PaymentTransaction';
// import { CurrencyToSymbol } from '../enums/Currency';
// import { IEarningResponseDto } from '../dto/IEarningResponseDto';
// import { IPaginatedList } from '../dto/IPaginatedList';
// import { IFinancialTransactionResponseDto } from '../dto/IFinancialTransactionResponseDto';
// import { WalletType } from '../enums/WalletType';


// // DO NOT EXPORT DEFAULT

// @Route("api/wallet")
// @Tags('Wallet')
// @Security("jwt")
// export class WalletController extends Controller {
  
//   @Get('/main/balance')
//   public async mainWalletBalance(@Request() req: any): Promise<IServerResponse<{currency: string, currencySymbol: string, amountMajor: number}>> {
//     const currentUser: User = req.user
    
//     const connection = await getFreshConnection()
//     const walletRepo = connection.getRepository(Wallet)
//     const wallet = await walletRepo.findOne({
//       where: { id: currentUser.id, type: WalletType.CUSTOMER_WALLET },
//       order: { createdAt: 'ASC' }
//     })
//     const currencySymbol = CurrencyToSymbol[wallet?.currency] || '₦'

//     const resData: IServerResponse<{currency: string, currencySymbol: string, amountMajor: number}> = {
//       status: true,
//       data: {
//         currency: wallet?.currency,
//         currencySymbol,
//         amountMajor: (wallet?.walletBalanceMinor || 0) / 100
//       }
//     }
//     return resData
//   }

//   @Post('/withdraw')
//   public async withdraw(@Request() req: any, @Body() reqBody: WithdrawFundsRequestDto): Promise<IServerResponse<IFinancialTransactionResponseDto>> {
//     const { amountMajor, password, } = reqBody
//     const currentUser: User = req.user

//     const match = await bcrypt.compare(password, currentUser.passwordHash)
//     if (!match) {
//       throw new UnauthorizedRequestError('User credentials are wrong.')
//     }

//     const sourceWallet = await WalletService.getCustomerWallet(currentUser.id)
  
//     const walletBalanceMinor = sourceWallet?.walletBalanceMinor || 0  
//     const amountMinor = amountMajor * 100

//     if(walletBalanceMinor < amountMinor) {
//       throw new UnprocessableEntityError(`Insufficient balance for your withdrawal including the transaction charge`)
//     }

//     if (!currentUser.bankInfo?.bankName) {
//       throw new UnprocessableEntityError('Please set your bank account information')
//     }
//     // const withdrawalRequestEmailSentSuccessfully = await EmailService.sendWithdrawalRequestToFinance(currentUser,
//     //   amountMajor, account.bankInfo?.bankName, bankAccountNumber, bankAccountName)

//     // if (!withdrawalRequestEmailSentSuccessfully) {
//     //   throw new ServerError('An error occurred. Please try again later')
//     // }

//     const finalFinancialTransaction = await WalletService.saveWithdrawalTransaction(sourceWallet, amountMinor, PaymentTransactionStatus.PAID)

//     const resData: IServerResponse<IFinancialTransactionResponseDto> = {
//       status: true,
//       data: finalFinancialTransaction.toResponseDto()
//     }

//     return resData
//   }


//   @Get('/transactions')
//   public async financialTransactions(@Request() req: any, 
//       @Query('pageNumber') pageNumber: any, 
//       @Query('sortOrder') sortOrder: SortOrder): Promise<IServerResponse<IPaginatedList<IFinancialTransactionResponseDto>>> {
//     const currentUser: User = req.user

//     const pageSize = 10
//     const query = {
//       userId: currentUser.id,
//       paidStatus: PaymentTransactionStatus.PAID
//     }
//     const pageResult = await paginate(FinancialTransaction, query, pageSize, pageNumber, sortOrder)

//     const formattedDataSet: IFinancialTransactionResponseDto[] = pageResult.dataset.map(dataRecord => {
//       const transaction = dataRecord as FinancialTransaction
//       return transaction.toResponseDto()
//     })

//     const resData = {
//       status: true,
//       data: {...pageResult, dataset: formattedDataSet}
//     }
    
//     return resData
//   }

//   @Get('/earnings')
//   public async earnings(@Request() req: any): Promise<IServerResponse<IEarningResponseDto>> {
//     const currentUser: User = req.user
    
//     const sixMonthsAgoMoment = moment.utc().add(-6, 'months')

//     const connection = await getFreshConnection()

//     const earningbyMonthRepo = connection.getRepository(EarningsByMonth)
//     const userMonthEarnings = await earningbyMonthRepo.find({
//       userId: currentUser.id,
//       createdAt: MoreThan(sixMonthsAgoMoment.toDate())
//     })

//     const formattedMonthEarnings = userMonthEarnings.map(earning => {
//       return {
//         monthISO8601: earning.monthISO8601,
//         totalEarningsMajor: earning.totalEarningsMinor / 100
//       }
//     })

//     const earningsByYearRepo = connection.getRepository(EarningsByYear)
//     const year = moment.utc().format('YYYY')
//     const userYearEarning = await earningsByYearRepo.findOne({
//       userId: currentUser.id,
//       year,
//     })

//     const wallet = await WalletService.getCustomerWallet(currentUser.id)

//     const currencySymbol = CurrencyToSymbol[wallet.currency] || '₦'

//     const resData = {
//       status: true,
//       data: {
//         currentYearEarningsMajor: userYearEarning ? userYearEarning.totalEarningsMinor / 100 : 0,
//         monthEarnings: formattedMonthEarnings,
//         currency: wallet.currency,
//         currencySymbol,
//       }
//     }
    
//     return resData
//   }
// }
