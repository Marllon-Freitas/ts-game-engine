/* eslint-disable no-console */
import { MessagePriority } from '../utils';
import { IMessageHandler } from './interfaces/IMessageHandler';
import { Message } from './message';
import { MessageSubscriptionNode } from './messageSubscriptionNode';

/**
 * Responsible for transporting messages from one location to another.
 */
export class MessageManager {
  // private methods and attributes:
  private static m_subscriptions: { [code: string]: IMessageHandler[] } = {};
  private static m_normalQueueMessagesPerUpdate: number = 10;
  private static m_normalMessageQueue: MessageSubscriptionNode[] = [];

  private constructor() {}

  // public methods and attributes:
  public static addSubscription(code: string, handler: IMessageHandler): void {
    if (this.m_subscriptions[code] === undefined) {
      this.m_subscriptions[code] = [];
    }

    if (this.m_subscriptions[code].indexOf(handler) !== -1) {
      console.warn(
        `MessageManager: Handler already subscribed to message code ${code}. Subscription ignored.`
      );
    } else {
      this.m_subscriptions[code].push(handler);
    }
  }

  public static removeSubscription(code: string, handler: IMessageHandler): void {
    if (this.m_subscriptions[code] === undefined) {
      console.warn(
        `MessageManager: Cannot remove subscription. No handler subscribed to message code ${code}.`
      );
      return;
    }

    let index = this.m_subscriptions[code].indexOf(handler);
    if (index !== -1) this.m_subscriptions[code].splice(index, 1);
  }

  public static post(message: Message): void {
    console.log('MessageManager: Posting message:', message);
    let handlers = this.m_subscriptions[message.code];
    if (!handlers) {
      console.warn(`MessageManager: No handlers subscribed to message code ${message.code}.`);
      return;
    }

    for (let handler of handlers) {
      if (message.priority === MessagePriority.HIGH) {
        handler.onMessage(message);
      } else {
        this.m_normalMessageQueue.push(new MessageSubscriptionNode(message, handler));
      }
    }
  }

  public static update(): void {
    if (this.m_normalMessageQueue.length === 0) return;

    let messageLimit = Math.min(
      this.m_normalQueueMessagesPerUpdate,
      this.m_normalMessageQueue.length
    );

    for (let i = 0; i < messageLimit; i++) {
      let node = this.m_normalMessageQueue.shift();
      if (node) {
        node.handler.onMessage(node.message);
      }
    }
  }
}
