export enum RabbitMQ {
  EmailQueue = 'emails',
}

export enum EmailMSG {
  CREATE = 'CREATE_EMAIL',
  FIND_ALL = 'FIND_EMAILS',
  FIND_ONE = 'FIND_EMAIL',
  UPDATE = 'UPDATE_EMAIL',
  DELETE = 'DELETE_EMAIL',
  VALID_EMAIL = 'VALID_EMAIL',
}
