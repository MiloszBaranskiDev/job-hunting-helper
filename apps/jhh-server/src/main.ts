import { Express } from 'express';
import * as dotenv from 'dotenv';

import { JhhServerApp } from '@jhh/jhh-server/app';

dotenv.config();

const host: string = process.env.HOST ?? 'localhost';
const port: number = process.env.PORT ? Number(process.env.PORT) : 3000;

const app: Express = JhhServerApp();

app.listen(port, () => {
  console.log(`hello on http://${host}:${port}`);
});
