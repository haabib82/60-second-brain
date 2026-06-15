
# 60-Second Brain

An immersive, fast-paced micro-game hub designed to test, train, and stretch your cognitive reflexes in exactly 60 seconds. Built with a modern, modular architecture leveraging Next.js App Router, Tailwind CSS, and TypeScript.

---

## Core Idea 
 A digital platform built around the idea that anyone can challenge themselves, compete, and improve in just 60 seconds.



I would create a 60S Universe. where on the deashboard we would have the 

the different games Examples:

60 Second Memory

60 Second Focus

60 Second Reaction

60 Second Speed Math

60 Second Pattern Match

60 Second Word Challenge

etc etc and more and more will be added in the future and 

when the person click on any of them he will be redirect to the game the game run for the 60 second and the person perfoms his task there 
## Architecture & Technical Workflow

The core philosophy of this project is **strict component modularity**. Instead of rewriting game states (Start, Countdown, Loop, and Results Screens) inside every single game, the system abstracts the visual shells into universal structural wrappers. This design pattern reduces boilerplate and makes scaling to hundreds of micro-challenges incredibly straightforward.

### The Routing Journey

```text
[ Landing Dashboard ] (app/page.tsx)
│
▼   Clicks game card (e.g., id: "focus")
[ Dynamic Route ]   (app/play/[gameId]/page.tsx)
│
▼   Evaluates gameId string using switch-case
[ Game Component ]  (components/games/FocusGame.tsx)
│
└─► Injects state layout shells from (components/games/ui/*)

```

1. **The Entry Point (`app/page.tsx`)**: Displays an animated dashboard featuring game selection cards. Selecting a challenge runs standard Next.js navigation:
```tsx
<Link href={`/play/${game.id}`}>
  <span>Play {game.name}</span>
</Link>

```


2. **The Route Gatekeeper (`app/play/[gameId]/page.tsx`)**: Intercepts the parameterized URI. It parses `gameId` cleanly through an asymmetric `switch-case` block and lazy-mounts the corresponding high-level game logic engine (e.g., `<FocusGame />` or `<MemoryGame />`). Unrecognized routes gracefully trigger Next.js `notFound()`.
3. **The State Injector (`components/games/*`)**: Manages timer refs, state flags (`start` | `countdown` | `playing` | `end`), score updates, local storage interactions, and AudioContext oscillators. It acts purely as a logical controller, shifting data variables directly into the centralized UI frames.

---

## File Structure

```text
60-second-brain/
├── app/
│   ├── play/
│   │   └── [gameId]/
│   │       └── page.tsx        # Dynamic route multiplexer / router 
│   ├── layout.tsx              # Application layout context
│   └── page.tsx                # Central dashboard landing deck
├── components/
│   └── games/
│       ├── ui/                 # Shared UI structural wrappers
│       │   ├── GameCountdownScreen.tsx
│       │   ├── GameEndScreen.tsx
│       │   ├── GameStartScreen.tsx
│       │   └── GameWrapper.tsx
│       ├── FocusGame.tsx       # Focus Grid specific game file 
│       └── MemoryGame.tsx      # Memory specific game file (Logic-only)
├── public/                     # Static layout optimization files
├── next.config.ts              # Next.js optimization runtime
├── tsconfig.json               # TypeScript path mapping aliases (@/*)
└── package.json

```

---

## Shared UI Ecosystem (`components/games/ui/`)

To optimize scalability, layout presentation is segregated cleanly into standalone components. The logic-heavy game containers act as state providers that pass handlers directly down into these UI shells:

| Component File | Role & Target Action |
| --- | --- |
| **`GameWrapper.tsx`** | Injects high-performance glowing ambient backdrops, CSS blur orbs, typography branding headers, and acts as the responsive center-dock element. |
| **`GameStartScreen.tsx`** | Pulls custom rules strings and reads structural historical high scores from `localStorage`, rendering them inside card blocks with a uniform `START` trigger hook. |
| **`GameCountdownScreen.tsx`** | A structural `3 ➔ 2 ➔ 1 ➔ GO` visual ticking layout to synchronize player attention before loops kick-off. |
| **`GameEndScreen.tsx`** | Evaluates final execution stats, presents dynamic algorithmic percentile indicators, yields context-aware progress messaging, and exposes sharing hooks using the Web Share API. |

---

## Performance Optimization & Scalability

* **Web Audio API Engine**: Game sounds use direct hardware-synthesized oscillators (`AudioContext`) rather than streaming bulky MP3 tracks, ensuring zero audio-latency when actions flash on screen.
* **Atomic CSS Tailwinds**: All styling relies fully on Tailwind CSS primitives, featuring hardware-accelerated grid states, custom tracking values (`tracking-[0.35em]`), and fast blur layer matrices.
* **Zero Boilerplate Extension**: Want to add a new game? Simply spin up your custom game logic file inside `components/games/`, hook it up to the shared UI wrappers, and drop its initialization match-string case straight inside `app/play/[gameId]/page.tsx`.

---

## Getting Started

Follow these steps to set up and run the project locally:

1. **Clone the project repository:**
```bash
git clone [https://github.com/abbas/60-second-brain.git](https://github.com/abbas/60-second-brain.git)
cd 60-second-brain

```


2. **Install dependency groups:**
```bash
npm install

```


3. **Boot up the local development instance:**
```bash
npm run dev

```


4. **Access your client dashboard:**
Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.


