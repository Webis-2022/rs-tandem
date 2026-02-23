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

4. Create .env file from .env.example

5. Run development server:
   npm run dev

Project will be available at:
http://localhost:3000

## Branch Strategy

- main — stable production branch
- develop — integration branch
- feature/\* — feature branches

All changes must go through pull request.

## For Developers:

- [Add new route and page](./src/docs/new-route.md)
- [Supabase API methods](./src/docs/api-test-guide.md)
