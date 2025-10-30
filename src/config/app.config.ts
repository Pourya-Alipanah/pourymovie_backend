import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  frontendMoviePath: process.env.FRONTEND_MOVIE_PATH || '/movies',
  frontendSeriesPath: process.env.FRONTEND_SERIES_PATH || '/series',
}));
