/* eslint-disable no-unused-vars */
import { IMessageHandler } from './iMessageHandler'
import { MessageBus } from './messageBus'

export enum MessagePriority {
  NORMAL,
  HIGH
}

export class Message {
  public code: string
  public context: unknown
  public sender: unknown
  public priority: MessagePriority

  constructor(
    code: string,
    sender: unknown,
    priority: MessagePriority = MessagePriority.NORMAL,
    context?: unknown
  ) {
    this.code = code
    this.sender = sender
    this.priority = priority
    this.context = context
  }

  public static sendMessage(
    code: string,
    sender: unknown,
    context?: unknown
  ): void {
    MessageBus.postMessage(
      new Message(code, sender, MessagePriority.NORMAL, context)
    )
  }

  public static sendPriorityMessage(
    code: string,
    sender: unknown,
    context?: unknown
  ): void {
    MessageBus.postMessage(
      new Message(code, sender, MessagePriority.HIGH, context)
    )
  }

  public static subscribe(code: string, handler: IMessageHandler): void {
    MessageBus.addSubscription(code, handler)
  }

  public static unsubscribe(code: string, handler: IMessageHandler): void {
    MessageBus.removeSubscription(code, handler)
  }
}
