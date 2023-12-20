
export enum BankAccountColumns {
  USER_ID = "user_id",
  BANK_NAME = "bank_name",
  ACCOUNT_NAME = "account_name",
  ACCOUNT_NUMBER = "account_number",
}



export enum SavedProductColumns {
  USER_ID = "user_id",
  PRODUCT_ID = "product_id",
}



export enum UserColumns {
  UUID = "uuid",
  USER_NAME = "user_name",
  EMAIL_ADDRESS = "email_address",
  PASSWORD_HASH = "password_hash",
  ROLE = "role",
  PHOTO = "photo",
  BIO = "bio",
}

export enum QuestionColumns {
  UUID = "uuid",
  TITLE = "title",
  CONTENT = "content",
  PHOTOS = "photos",
  USER_ID = "user_id",
  VOTE_COUNTS = "vote_counts"
}

export enum AnswerColumns {
  UUID = "uuid",
  CONTENT = "content",
  QUESTION_ID = "question_id",
  USER_ID = "user_id",
  VOTE_COUNTS = "vote_counts"
}
export enum TicketColumns {
  UUID = "ticket_uuid",
  USER_ID = "user_id",
  NAME = "name",
  DESCRIPTION = "description",
  CUSTOMER_EMAIL = "customer_email",
  STATUS = "status",
  IMAGES = "images"
}

export enum CronRunColumns {
  UUID = "cron_run_uuid",
  NAME = "name",
  IS_RUNNING = "is_running",
  LAST_RUN_START = "last_run_start",
  LAST_RUN_END = "last_run_end",
}
export enum WalletColumns {
  USER_ID = "user_id",
  WALLET_BALANCE_MINOR = "wallet_balance_minor",
  CURRENCY = "currency",
  TYPE = "type",
}



export const TableColumns: any = {
  ID: "id",
  IS_ENABLED: "is_enabled",
  CREATED_AT: "created_at",
  UPDATED_AT: "updated_at",
};

export default TableColumns;
