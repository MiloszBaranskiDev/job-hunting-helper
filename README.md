# Job Hunting Helper

Job Hunting Helper it's a comprehensive application designed to streamline the job search and preparation process. This application provides a powerful toolkit for job seekers to manage their recruitments, prepare for interviews, and track their progress.

[Live demo](https://job-hunting-helper.netlify.app/)

## Features

- **User authentication**
- **Offers**
  - A dynamic table displays job offers with features such as sorting, filtering, and pagination. Detailed pages for individual offers include tracking status updates
- **Schedule**
  - Manage job search related events with an interactive calendar.
- **Board**
  - Organize tasks and job application steps using a kanban board for better task management.
- **Practice**
  - Engage with quizzes to prepare for interviews. Track historical results of quizzes.
- **Notes**
  - Create and manage notes with a rich content editor.
- **Light/Dark mode**

## Stack

- TypeScript
- Angular
- RxJS
- NgRx
- SCSS
- Angular Material
- Node.js
- Express.js
- MongoDB
- Prisma ORM
- Nx

## Installation

1. `git clone https://github.com/MiloszBaranskiDev/job-hunting-helper`
2. `cd job-hunting-helper`
2. `npm i`

## Setup

Create .env file in root folder and complete with your data

```
DATABASE_URL="your_url_here"
HOST="localhost"
PORT=5001
JWT_SECRET="your_secret_here"
NODE_ENV=development
```

Then generate prisma using command below

`npx prisma generate`

If you changed host or port remember to update apiUrl in environment.ts (libs/jhh-client/shared/config)

```
import { Environment } from './environment.interface';

export const environment: Partial<Environment> = {
  production: false,
  apiUrl: 'http://localhost:5001',
};
```

## Run app

`npm run serve:jhh`

## Run tests

`npm run test:jhh`

## Recommended environment
- node 18.12.0
- npm 8.19.2

## Issues
If you have any issues with the application or installation, please [contact me](https://miloszbaranskidev.github.io/my-website/)

![1](https://github.com/MiloszBaranskiDev/job-hunting-helper/assets/66494943/4575a5f7-b775-48a5-9288-f2fb02c42ad4)
![2](https://github.com/MiloszBaranskiDev/job-hunting-helper/assets/66494943/0ce13954-5bfe-411a-aa8c-b65bfa8a4447)
![3](https://github.com/MiloszBaranskiDev/job-hunting-helper/assets/66494943/2643d0fc-4fb0-4d36-a262-f0a10a164b31)
![4](https://github.com/MiloszBaranskiDev/job-hunting-helper/assets/66494943/994ede36-d1bf-4633-aa47-bd679f1a5748)
![5](https://github.com/MiloszBaranskiDev/job-hunting-helper/assets/66494943/b8146bd1-2369-4078-8774-5d1b87cbf625)
