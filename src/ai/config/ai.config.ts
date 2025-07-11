import { registerAs } from '@nestjs/config';

export default registerAs('AI', () => {
  return {
    apikey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL_NAME,
  };
});
