import { IMessageHandler } from './interfaces/IMessageHandler';
import { Message } from './message';

/**
 * Represents a subscription to a message.
 * It contains the message to be handled and the handler that will process it.
 */
export class MessageSubscriptionNode {
  public message: Message;
  public handler: IMessageHandler;

  constructor(message: Message, handler: IMessageHandler) {
    this.message = message;
    this.handler = handler;
  }
}
