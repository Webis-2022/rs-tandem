# RSS Tandem App – DOMinator

## About the project

### App Deploy Link: [DOMinator App](https://webis-2022-rs-tandem.netlify.app/)

### Project description

HTML & CSS Trainer for interview preparation. The app generates a wide range of questions on key topics using a language model, helping you reinforce knowledge and identify gaps. Suitable for both revising fundamentals and deeper practice. A convenient training format makes learning fast and effective.

### Video Demo

- [RSS Tandem App Checkpoint 7 Preview](https://youtu.be/G-3mqGBa_RM). This video contains a demo about app pages and topics completion.

- [RSS Tandem App Checkpoint 5 Preview](https://youtu.be/HWwnsfwI7CI). This video contains small demo about loading state, error handling and 404 page - it's all for 5th week of the development.

### What we are proud of in this project

We are proud that we were able to build this trainer despite all the difficulties, including those not directly related to development.

During this project, each of us learned something new. We tried working with the backend, and for some of us it was the first such experience. We also learned how to integrate an AI agent into the application for question generation and explored GitHub features for team collaboration in more depth.

## Team and diaries

- [Jevgeni Verjovkin](https://github.com/Webis-2022/Jevgeni-Verjovkin), link to diary - [Webis-2022](https://github.com/Webis-2022/rs-tandem/tree/main/development-notes/Webis-2022)
- [Aleksandra Potapova](https://github.com/alekspanda), link to diary - [alekspanda](https://github.com/Webis-2022/rs-tandem/tree/main/development-notes/alekspanda)
- [Sergei Urazov](https://github.com/urazof), link to diary - [Urazof](https://github.com/Webis-2022/rs-tandem/tree/main/development-notes/Urazof)

## Trello

- [Trello board link](https://trello.com/b/sp5J9fxW/my-trello-board)
- [Trello board screen](./development-notes/meeting-notes/Trello-screen.png)

## The best PRs

These pull requests were selected as the best ones because they made a significant contribution to the application and went through a meaningful review process.

- [PR #112 Feature/disable and mark completed topics](https://github.com/Webis-2022/rs-tandem/pull/112)
- [PR #120 Feature/game achievements.](https://github.com/Webis-2022/rs-tandem/pull/120)
- [PR #144 Fix/redirecting, super-game, state before render.](https://github.com/Webis-2022/rs-tandem/pull/144)
- [PR #156 Feature/login resume game choice.](https://github.com/Webis-2022/rs-tandem/pull/156)

## Meeting notes

- [First meeting](https://github.com/Webis-2022/rs-tandem/blob/main/development-notes/meeting-notes/DevBand-2026-02-17.md)
- [Second meeting](https://github.com/Webis-2022/rs-tandem/blob/main/development-notes/meeting-notes/DevBand-2026-02-19.md)
- [Third meeting](https://github.com/Webis-2022/rs-tandem/blob/main/development-notes/meeting-notes/DevBand-2026-03-08.md)
- [Fourth meeting](https://github.com/Webis-2022/rs-tandem/blob/main/development-notes/meeting-notes/DevBand-2026-03-16.md)
- [Fifth meeting](https://github.com/Webis-2022/rs-tandem/blob/main/development-notes/meeting-notes/DevBand-2026-03-23.md)

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

5. After running the server, open the URL shown in the terminal

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
