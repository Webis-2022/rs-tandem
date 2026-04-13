# rs-tandem

## Project description

HTML Trainer for interview preparation. Generating questions on various topics using LLM.

## Team:

- Jevgeni Verjovkin - https://github.com/Webis-2022/Jevgeni-Verjovkin
- Aleksandra Potapova - https://github.com/alekspanda
- Sergei Urazov - https://github.com/urazof

## Game Rules

This training app follows a quiz-based system designed to simulate real interview preparation for HTML and CSS.

---

### Scoring System

- Each correct answer gives **+1 point**
- Each incorrect answer gives **−1 point**

---

### Topic Completion & Super Game

At the end of each topic, if the user answered any questions incorrectly, they are offered a **Super Game**.

The Super Game includes only the questions that were answered incorrectly during the topic.

---

### Super Game Rules

- The user must answer **all questions correctly** to win the Super Game

#### If the user answers all questions correctly:

- They receive **+1 point for each question** in the Super Game
- The total bonus is **added only after all questions are completed**

#### If the user answers at least one question incorrectly:

- The Super Game ends immediately
- The user loses points equal to the number of remaining unanswered questions

---

### Hints System

The following hints are available during each topic:

- **50/50** — removes two incorrect options
- **Call a Friend** — suggests a possible correct answer
- **I Don’t Know** — opens an explanation panel for the current question

Each hint can be used **only once per topic**

---

### Game Completion & Achievements

At the end of the game, the user receives an **achievement badge** based on their final score.

The badge is:

- Displayed on the final screen
- **Saved to the database**
- Available later in the results/history section

#### Achievement Levels

| Score Range | Badge  | Description                                                          |
| ----------- | ------ | -------------------------------------------------------------------- |
| ≤ 50        | Loser  | Insufficient knowledge of HTML and CSS. More practice is recommended |
| 51–85       | Master | Solid understanding of HTML and CSS with room for improvement        |
| 86–100      | Guru   | Excellent knowledge and strong readiness for interviews              |

---

### Game End Options

After completing the game, the user can:

- **Restart the game** (progress will be reset)
- Go to the **Library** section

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
