/* eslint-disable no-unused-vars */
import { Message } from './message'

export interface IMessageHandler {
  onMessage(message: Message): void
}
