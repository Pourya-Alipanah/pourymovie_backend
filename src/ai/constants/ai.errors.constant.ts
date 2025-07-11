/**
 * Error message for general errors
 * This message is used when an unexpected error occurs in the application.
 */
export const GENERAL_ERROR_MESSAGE = 'Internal server error';

/**
 * Error message for WebSocket authentication failure
 */
export const WS_AUTH_ERROR = 'Token invalid or missing';

/**
 * Error message for AI title not found
 * This message is returned when no movie titles are found in the user's request.
 */
export const AI_TITLE_NOT_FOUND ="Sorry, I couldn't find any movie in your request.";

/**
 * failed to parse AI response for movie extraction
 */
export const FAILED_JSON_PARSE='Failed to parse AI response for movie extraction:'

/**
 * Error message for invalid payload in AI service
 * This message is used when the payload provided to the AI service is not a valid number.
 */
export const INVALID_PAYLOAD_TITLE_ID = 'Invalid payload. Expected a number.';