# **Where's Waldo – Photo Tagging Game**

A playful photo tagging web app inspired by the classic "Where’s Waldo?" game. Built to deepen my fullstack development skills, it challenges users to spot Waldo in a crowded image and records their fastest times!

## 🧰 Tech Stack
- 🎨 **Frontend**: React (TypeScript), TailwindCSS
- 🛠️ **Backend**: Node.js, Express, Prisma ORM, PostgreSQL

```
/frontend     – Main user-facing app (play the game)
/backend      – REST API (photo tagging logic, scores)
```

## ✨ Gameplay

### (`/frontend`)
- Users are presented with a large, crowded illustration and must find and tag Waldo by clicking the correct spot.
- Click anywhere on the image to bring up a targeting box. Select "Waldo" from the dropdown to submit your guess.
- Get instant feedback on whether you found Waldo or need to keep searching.
- Your time starts when the image loads and ends when you find Waldo. Try to get your fastest time!
- If you find Waldo, enter your name and see how you stack up on the leaderboard.

### (`/backend`)
- Waldo’s exact coordinates are saved in the database and validated server-side.
- Tracks and stores top player scores with timestamps and names.
