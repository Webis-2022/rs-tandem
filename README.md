# rs-tandem

## Project description

HTML Trainer for interview preparation. Generating questions on various topics using LLM.

## Team:

- Jevgeni Verjovkin - https://github.com/Webis-2022/Jevgeni-Verjovkin
- Aleksandra Potapova - https://github.com/alekspanda
- Anna Makarenko - https://github.com/thefoxtale
- Sergei Urazov - https://github.com/urazof

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
