export interface ChatMessageProps {
  id: string;
  chatId: string;
  content: string;
  draftContent?: string;
  parentId?: string;
  senderId: string;
  recipientId?: string;
  type: string;
  sender: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ChatMessageEntity {
  private _id: string;
  private _chatId: string;
  private _content: string;
  private _draftContent?: string;
  private _parentId?: string;
  private _senderId: string;
  private _recipientId?: string;
  private _type: string;
  private _sender: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ChatMessageProps) {
    this._id = props.id;
    this._chatId = props.chatId;
    this._content = props.content;
    this._draftContent = props.draftContent;
    this._parentId = props.parentId;
    this._senderId = props.senderId;
    this._recipientId = props.recipientId;
    this._type = props.type;
    this._sender = props.sender;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }

  get chatId() {
    return this._chatId;
  }

  get content() {
    return this._content;
  }

  get draftContent() {
    return this._draftContent;
  }

  get parentId() {
    return this._parentId;
  }

  get senderId() {
    return this._senderId;
  }

  get recipientId() {
    return this._recipientId;
  }

  get type() {
    return this._type;
  }

  get sender() {
    return this._sender;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}
