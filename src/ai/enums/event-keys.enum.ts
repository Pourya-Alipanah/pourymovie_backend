/**
 * Enum for WebSocket event keys used in the AI module.
 */
export enum EventKeys {
  SUBSCRIBE_AI_EVENT_KEY = 'AI-message',
  SUBSCRIBE_AI_RESPONSE_EVENT_KEY = 'AI-message-response',
  GENERAL_ERROR_EVENT_KEY = 'general-error',
  WS_AUTH_ERROR_EVENT_KEY = 'unauthorized',
}
