import { C2C_MESSAGE_CREATE_TYPE } from '../message/C2C_MESSAGE_CREATE'
import { GROUP_AT_MESSAGE_CREATE_TYPE } from '../message/GROUP_AT_MESSAGE_CREATE'
import { ERROR_TYPE } from '../message/ERROR'
export type QQBotGroupEventMap = {
  C2C_MESSAGE_CREATE: C2C_MESSAGE_CREATE_TYPE
  GROUP_AT_MESSAGE_CREATE: GROUP_AT_MESSAGE_CREATE_TYPE
  ERROR: ERROR_TYPE
  // more events...
}
