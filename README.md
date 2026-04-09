# RSS Tandem App – DOMinator

## Project description

HTML & CSS Trainer for interview preparation. The app generates a wide range of questions on key topics using a language model, helping you reinforce knowledge and identify gaps. Suitable for both revising fundamentals and deeper practice. A convenient training format makes learning fast and effective.

## What we are proud of in this project

We are proud that we were able to build this trainer despite all the difficulties, including those not directly related to development.

During this project, each of us learned something new. We tried working with the backend, and for some of us it was the first such experience. We also learned how to integrate an AI agent into the application for question generation and explored GitHub features for team collaboration in more depth.

## Video Demo

- [RSS Tandem App Checkpoint 5 Preview](https://youtu.be/HWwnsfwI7CI). This video contains small demo about loading state, error handling and 404 page - it's all for 5th week of the development.

## Team:

- [Jevgeni Verjovkin](https://github.com/Webis-2022/Jevgeni-Verjovkin), link to diary - [Webis-2022](https://github.com/Webis-2022/rs-tandem/tree/main/development-notes/Webis-2022)
- [Aleksandra Potapova](https://github.com/alekspanda), link to diary - [alekspanda](https://github.com/Webis-2022/rs-tandem/tree/main/development-notes/alekspanda)
- [Sergei Urazov](https://github.com/urazof), link to diary - [Urazof](https://github.com/Webis-2022/rs-tandem/tree/main/development-notes/Urazof)

## Meeting notes:

- [First meeting](https://github.com/Webis-2022/rs-tandem/blob/main/development-notes/meeting%20notes/DevBand-2026-02-17.md)
- [Second meeting](https://github.com/Webis-2022/rs-tandem/blob/main/development-notes/meeting%20notes/DevBand-2026-02-19.md)
- [Third meeting](https://github.com/Webis-2022/rs-tandem/blob/main/development-notes/meeting%20notes/DevBand-2026-03-08.md)
- [Fourth meeting](https://github.com/Webis-2022/rs-tandem/blob/main/development-notes/meeting%20notes/DevBand-2026-03-16.md)
- [Fifth meeting](https://github.com/Webis-2022/rs-tandem/blob/main/development-notes/meeting%20notes/DevBand-2026-03-23.md)

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
