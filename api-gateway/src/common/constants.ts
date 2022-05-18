export enum RabbitMQ {
    UserQueue = 'users',
    EmailQueue = 'emails',
  }
  
  export enum UserMSG {
    CREATE = 'CREATE_USER',
    FIND_ALL = 'FIND_USERS',
    FIND_ONE = 'FIND_USER',
    UPDATE = 'UPDATE_USER',
    DELETE = 'DELETE_USER',
    VALID_USER = 'VALID_USER',
  }

  export enum EmailMSG {
    CREATE = 'CREATE_EMAIL',
    FIND_ALL = 'FIND_EMAILS',
    FIND_ONE = 'FIND_EMAIL',
    UPDATE = 'UPDATE_EMAIL',
    DELETE = 'DELETE_EMAIL',
    VALID_EMAIL = 'VALID_EMAIL',
  }