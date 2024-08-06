import { IMessageHandler } from './iMessageHandler'
import { Message, MessagePriority } from './message'
import { MessageSubscriptionNode } from './messageSubscriptionNode'

export class MessageBus {
  private static m_subscriptions: { [code: string]: IMessageHandler[] } = {}
  private static m_normalQueueMessagePerUpdate: number = 10
  private static m_normalMessageQueue: MessageSubscriptionNode[] = []
  private constructor() {}

  public static addSubscription(code: string, handler: IMessageHandler): void {
    if (!MessageBus.m_subscriptions[code]) {
      MessageBus.m_subscriptions[code] = []
    }

    if (MessageBus.m_subscriptions[code].indexOf(handler) >= 0) {
      console.warn(
        '[MessageBus] Attempting to add a duplicate handler to code ',
        code,
        'subscription not added'
      )
      return
    }

    MessageBus.m_subscriptions[code].push(handler)
  }

  public static removeSubscription(
    code: string,
    handler: IMessageHandler
  ): void {
    if (!MessageBus.m_subscriptions[code]) {
      console.warn(
        '[MessageBus] Can not unsubscribe handler from message code',
        code,
        '. It does not have any subscriptions'
      )
      return
    }

    const nodeIndex = MessageBus.m_subscriptions[code].indexOf(handler)
    if (nodeIndex !== -1) {
      MessageBus.m_subscriptions[code].splice(nodeIndex, 1)
    }
  }

  public static postMessage(message: Message): void {
    const handlers = MessageBus.m_subscriptions[message.code]
    if (handlers) {
      handlers.forEach((handler) => {
        if (message.priority === MessagePriority.HIGH) {
          handler.onMessage(message)
        } else {
          MessageBus.m_normalMessageQueue.push(
            new MessageSubscriptionNode(message, handler)
          )
        }
      })
    }
  }

  // public static updateMessage(time: number): void {
  //   if (MessageBus.m_normalMessageQueue.length === 0) {
  //     return
  //   }

  //   const messageLimit = Math.min(
  //     MessageBus.m_normalQueueMessagePerUpdate,
  //     MessageBus.m_normalMessageQueue.length
  //   )

  //   for (let i = 0; i < messageLimit; i++) {
  //     const node = MessageBus.m_normalMessageQueue.shift()
  //     if (node) {
  //       node.handler.onMessage(node.message)
  //     }
  //   }
  // }
}
