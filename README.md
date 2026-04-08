# RSS Tandem App – DOMinator

## Project description

HTML Trainer for interview preparation. Generating questions on various topics using LLM.

## What we are proud of in this project

We are proud that we were able to build this trainer despite all the difficulties, including those not directly related to development.

During this project, each of us learned something new. We tried working with the backend, and for some of us it was the first such experience. We also learned how to integrate an AI agent into the application for question generation and explored GitHub features for team collaboration in more depth.

## Video Demo

- [RSS Tandem App Checkpoint 5 Preview](https://youtu.be/HWwnsfwI7CI). This video contains small demo about loading state, error handling and 404 page - it's all for 5th week of the development.

## Team:

- Jevgeni Verjovkin - https://github.com/Webis-2022/Jevgeni-Verjovkin
- Aleksandra Potapova - https://github.com/alekspanda
- Sergei Urazov - https://github.com/urazof

## Trello
- [Trello Board](https://trello.com/b/sp5J9fxW/my-trello-board)

## Tech Stack

- TypeScript
- Vite
- Vitest
- ESLint
- Prettier
- Sass (SCSS)
- Husky
- GitHub Actions (CI)

## How to run locally

### Requirements:

- Node.js >= 18
- npm >= 9

### Steps:

1. Clone repository:
   git clone [https://github.com/Webis-2022/rs-tandem.git](https://github.com/Webis-2022/rs-tandem.git)

2. Go to project folder:
   cd project

3. Install dependencies:
   npm install

4. Run development server:
   npm run dev

Project will be available at:
http://localhost:3000

## App Deploy Link

[https://webis-2022-rs-tandem.netlify.app/](https://webis-2022-rs-tandem.netlify.app/)

## Branch Strategy

- main — stable production branch
- develop — integration branch
- feature/\* — feature branches

All changes must go through pull request.

## APIService

Responsible for:

- Communication with Supabase (database, auth, edge functions)

- Calling Supabase Edge Functions (e.g. question batch generation)

- Normalizing and forwarding errors

- Optional retry logic for network failures

- Attaching session context automatically (handled via Supabase client)

- Returning clean data to higher layers (QuestionService, etc.)

Not responsible for:

- AI logic or prompt generation

- Business logic (game rules, scoring, validation)

- State management

- UI rendering

- Deciding when to generate vs reuse cached questions
  (this must be handled inside Edge Functions)
