export enum StatusEnum {
  ACTIVE = 1,
  NOT_ACTIVE = 0,
}

export enum ValidRolesEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
}

export enum ErrorNumberEnum {
  ErrorCode = 400,
  Success = 200,
  Information = 201,
  Warning = 300,
  Unauthorized = 401,
  Expired = 402,
  Forbidden = 403,
  NotFound = 404,
  InvalidValue = 405,
  ServerError = 500,
}

export enum BusinessTypeOtpEnum {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESTORE = 'RESTORE',
}
