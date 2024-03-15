import { Express } from 'express';
import * as dotenv from 'dotenv';

import { JhhServerApp } from '@jhh/jhh-server/app';

dotenv.config();

const host: string = process.env.HOST ?? 'localhost';
const port: number | undefined = process.env.PORT
  ? Number(process.env.PORT)
  : undefined;

const app: Express = JhhServerApp();

const baseUrl = `http://${host}${port ? `:${port}` : ''}`;

app.listen(port || undefined, () => {
  console.log(`Server running on ${baseUrl}`);
});
