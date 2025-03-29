import { MessagePriority } from '../utils';
import { IMessageHandler } from './interfaces/IMessageHandler';
import { MessageManager } from './messageManager';

export class Message {
  public code!: string;
  public sender: unknown;
  public context: unknown;
  public priority: MessagePriority;

  constructor(
    code: string,
    sender: unknown,
    context?: unknown,
    priority: MessagePriority = MessagePriority.NORMAL
  ) {
    this.code = code;
    this.context = context;
    this.sender = sender;
    this.priority = priority;
  }

  public static send(code: string, sender: unknown, context?: unknown): void {
    MessageManager.post(new Message(code, sender, context, MessagePriority.NORMAL));
  }

  public static sendHighPriority(code: string, sender: unknown, context?: unknown): void {
    MessageManager.post(new Message(code, sender, context, MessagePriority.HIGH));
  }

  public static subscribe(code: string, handler: IMessageHandler): void {
    MessageManager.addSubscription(code, handler);
  }

  public static unSubscribe(code: string, handler: IMessageHandler): void {
    MessageManager.removeSubscription(code, handler);
  }
}
