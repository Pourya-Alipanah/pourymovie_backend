/**
 * Enum for WebSocket event keys used in the AI module.
 */
export enum EventKeys {
  SUBSCRIBE_AI_EVENT_KEY = 'AI-message',
  SUBSCRIBE_AI_RESPONSE_EVENT_KEY = 'AI-message-response',
  SUBSCRIBE_AI_SUMMARY_EVENT_KEY = 'AI-summary',
  SUBSCRIBE_AI_SUMMARY_RESPONSE_EVENT_KEY = 'AI-summary-response',
  SUBSCRIBE_AI_COMMENTS_SUMMARY_EVENT_KEY = 'AI-comments-summary',
  SUBSCRIBE_AI_COMMENTS_SUMMARY_RESPONSE_EVENT_KEY = 'AI-comments-summary-response',
  SUBSCRIBE_AI_END_RESPONSE_EVENT_KEY = 'AI-message-end',
  GENERAL_ERROR_EVENT_KEY = 'general-error',
  WS_AUTH_ERROR_EVENT_KEY = 'unauthorized',
}
