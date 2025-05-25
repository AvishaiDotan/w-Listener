interface IMessageId {
  fromMe: boolean;
  remote: string;
  id: string;
  participant: string;
  _serialized: string;
}

interface IMessageSecret {
  [key: string]: number;
}

interface IReportingToken {
  [key: string]: number;
}

interface IReportingTag {
  [key: string]: number;
}

interface IReportingTokenInfo {
  reportingToken: IReportingToken;
  version: number;
  reportingTag: IReportingTag;
}

interface IMessageData {
  id: IMessageId;
  viewed: boolean;
  body: string;
  type: string;
  t: number;
  notifyName: string;
  from: string;
  to: string;
  author: string;
  ack: number;
  invis: boolean;
  isNewMsg: boolean;
  star: boolean;
  kicNotified: boolean;
  recvFresh: boolean;
  isFromTemplate: boolean;
  pollInvalidated: boolean;
  isSentCagPollCreation: boolean;
  latestEditMsgKey: null;
  latestEditSenderTimestampMs: null;
  mentionedJidList: any[];
  groupMentions: any[];
  isEventCanceled: boolean;
  eventInvalidated: boolean;
  isVcardOverMmsDocument: boolean;
  isForwarded: boolean;
  hasReaction: boolean;
  viewMode: string;
  messageSecret: IMessageSecret;
  productHeaderImageRejected: boolean;
  lastPlaybackProgress: number;
  isDynamicReplyButtonsMsg: boolean;
  isCarouselCard: boolean;
  parentMsgId: null;
  callSilenceReason: null;
  isVideoCall: boolean;
  callDuration: null;
  callCreator: null;
  callParticipants: null;
  isMdHistoryMsg: boolean;
  stickerSentTs: number;
  isAvatar: boolean;
  lastUpdateFromServerTs: number;
  invokedBotWid: null;
  bizBotType: null;
  botResponseTargetId: null;
  botPluginType: null;
  botPluginReferenceIndex: null;
  botPluginSearchProvider: null;
  botPluginSearchUrl: null;
  botPluginSearchQuery: null;
  botPluginMaybeParent: boolean;
  botReelPluginThumbnailCdnUrl: null;
  botMessageDisclaimerText: null;
  botMsgBodyType: null;
  reportingTokenInfo: IReportingTokenInfo;
  requiresDirectConnection: null;
  bizContentPlaceholderType: null;
  hostedBizEncStateMismatch: boolean;
  senderOrRecipientAccountTypeHosted: boolean;
  placeholderCreatedWhenAccountIsHosted: boolean;
  links: any[];
}

export interface IMessage {
  _data: IMessageData;
  mediaKey: undefined;
  id: IMessageId;
  ack: number;
  hasMedia: boolean;
  body: string;
  type: string;
  timestamp: number;
  from: string;
  to: string;
  author: string;
  deviceType: string;
  isForwarded: boolean;
  forwardingScore: number;
  isStatus: boolean;
  isStarred: boolean;
  broadcast: undefined;
  fromMe: boolean;
  hasQuotedMsg: boolean;
  hasReaction: boolean;
  duration: undefined;
  location: undefined;
  vCards: any[];
  inviteV4: undefined;
  mentionedIds: any[];
  groupMentions: any[];
  orderId: undefined;
  token: undefined;
  isGif: boolean;
  isEphemeral: undefined;
  links: any[];
}