import dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
export const PORT = Number(process.env.PORT) || 3000;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const MAX_PARTY_LINES = Number(process.env.MAX_PARTY_LINES) || 1;
export const INITIAL_RUMOR = process.env.INITIAL_RUMOR || 'Lorem Ipsum.';
export const DOCKER = Boolean(process.env.DOCKER);