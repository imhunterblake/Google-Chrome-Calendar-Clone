# Calendar

A simplified Google Calendar clone built with React and TypeScript.

## Features

- Month view that opens on the current month, with buttons to go to the previous/next month and jump back to today
- Past days are faded out and days outside the visible month have a darker background
- Add, edit and delete events (name, all day or start/end time, and red/green/blue color)
- Events are sorted with all day events first, then by start time
- Events are saved to `localStorage` so they persist after a page refresh
- When a day has more events than fit, a `+X More` button opens the rest in a modal. The number of visible events is recalculated whenever the day is resized or its events change.
- Animated modals built on the native `<dialog>` element, so they are keyboard accessible (focus is trapped inside, `Escape` closes them and focus returns to the button that opened them)
- Responsive layout that works down to mobile widths

## Running the project

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (22 LTS recommended), which includes npm
- [Git](https://git-scm.com/)

Check they are installed with `node -v` and `git -v`.

### Steps

1. Clone the repository and move into the project folder

   ```bash
   git clone https://github.com/imhunterblake/Google-Chrome-Calendar-Clone.git
   cd Google-Chrome-Calendar-Clone
   ```

2. Install the dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. Open the URL printed in the terminal (by default [http://localhost:5173](http://localhost:5173)) in your browser.

### Other scripts

| Command           | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `npm run build`   | Type checks the project and builds it for production to `dist` |
| `npm run preview` | Serves the production build locally (run `npm run build` first) |
| `npm run lint`    | Runs ESLint                                                  |

## Tech stack

- [React 19](https://react.dev/) with the [React Compiler](https://react.dev/learn/react-compiler) for automatic memoization
- [TypeScript](https://www.typescriptlang.org/) in strict mode
- [Vite](https://vite.dev/) for the dev server and build
- [date-fns](https://date-fns.org/) for date calculations and formatting
- CSS Modules for component scoped styles

## Project structure

```
src/
├── components/
│   ├── Button/              Reusable button with default/success/delete variants
│   ├── Calendar/            Month grid, individual days and event buttons
│   ├── EventFormModal/      Add/edit event form
│   ├── Modal/               Animated, accessible <dialog> wrapper
│   └── ViewMoreEventsModal/ Lists every event for a day
├── context/                 Events state and actions (add, update, delete)
├── hooks/
│   ├── useFittingItemCount.ts  Measures how many events fit in a day
│   └── useLocalStorage.ts      State persisted to localStorage
├── types/                   Event types
├── utils/                   Event sorting/parsing helpers
├── App.tsx
├── index.css                Global styles and color variables
└── main.tsx
```
