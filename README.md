# rs-tandem

## Project description

HTML & CSS Trainer for interview preparation. The app generates a wide range of questions on key topics using a language model, helping you reinforce knowledge and identify gaps. Suitable for both revising fundamentals and deeper practice. A convenient training format makes learning fast and effective.

## Team:

- Jevgeni Verjovkin - https://github.com/Webis-2022/Jevgeni-Verjovkin
- Aleksandra Potapova - https://github.com/alekspanda
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

5. After running the server, open the URL shown in the terminal

## App Deploy Link

[https://webis-2022-rs-tandem.netlify.app/](https://webis-2022-rs-tandem.netlify.app/)

## Branch Strategy

- main — stable production branch
- develop — integration branch
- feature/\* — feature branches

All changes must go through pull request.

## APIService

Handles all communication with Supabase, including database access, authentication, and Edge Function calls.

Responsibilities:
- Sending requests and returning normalized data
- Handling errors and optional retries
- Attaching session context automatically

Out of scope:
- Business logic (game rules, scoring)
- AI prompt generation
- State management and UI

## Video Demo

- https://youtu.be/HWwnsfwI7CI
- Video contains small demo about loading state, error handling and 404 page - it's all for 5th week of the development.
