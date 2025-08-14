import { ChatMessageEntity } from "./ChatMessage.entity";
import { ParticipantEntity } from "./Participant.entity";

export interface ChatProps {
  id: string;
  name: string;
  type: "private" | "groupal";
  isActive: boolean;
  description?: string;
  creatorId: string;
  participants: ParticipantEntity[];
  messages: ChatMessageEntity[];
  lastMessageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ChatEntity {
  private _id: string;
  private _name: string;
  private _type: "private" | "groupal";
  private _isActive: boolean;
  private _description?: string;
  private _creatorId: string;
  private _participants: ParticipantEntity[];
  private _messages: ChatMessageEntity[];
  private _lastMessageId?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ChatProps) {
    this._id = props.id;
    this._name = props.name;
    this._type = props.type;
    this._isActive = props.isActive;
    this._description = props.description;
    this._creatorId = props.creatorId;
    this._participants = props.participants;
    this._messages = props.messages;
    this._lastMessageId = props.lastMessageId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get isActive() {
    return this._isActive;
  }

  get description() {
    return this._description;
  }

  get creatorId() {
    return this._creatorId;
  }

  get participants() {
    return this._participants;
  }

  get messages() {
    return this._messages;
  }

  get lastMessageId() {
    return this._lastMessageId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  addParticipant(participant: ParticipantEntity) {
    this._participants.push(participant);
  }

  addMessage(message: ChatMessageEntity) {
    this._messages.push(message);
    this._lastMessageId = message.id;
  }
}
