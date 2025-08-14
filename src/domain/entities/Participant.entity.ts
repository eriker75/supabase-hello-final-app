export interface ParticipantProps {
  id: string;
  userId: string;
  chatId: string;
  role: string;
  joinedAt: Date;
}

export class ParticipantEntity {
  private _id: string;
  private _userId: string;
  private _chatId: string;
  private _role: string;
  private _joinedAt: Date;

  constructor(props: ParticipantProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._chatId = props.chatId;
    this._role = props.role;
    this._joinedAt = props.joinedAt;
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get chatId() {
    return this._chatId;
  }

  get role() {
    return this._role;
  }

  get joinedAt() {
    return this._joinedAt;
  }
}
