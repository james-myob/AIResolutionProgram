# Adventures of Wilfrid

A 2D mobile game about Wilfrid, a grey cat climbing a mountain to face a
giant winged monster cat. Built as a single self-contained HTML5 canvas
file — no build step, no dependencies. Open `index.html` on a phone
browser and play.

## How to play

- **Climb 1 — Furball Dodge:** Wilfrid runs automatically. Tap to jump
  over the furballs the monster cat sends down. Double-tap for a higher
  jump.
- **Climb 2 — Catnip Push:** Hold your finger down to push the catnip
  block up the mountain to the flag. The monster cat's eye-lasers sweep
  the path — watch for the red warning line and double-tap to jump clear
  before it strikes.
- **The Summit — Boss:** Face the monster cat itself. Survive its laser
  barrage by double-tapping to dodge.

Three hearts total across the whole run — lose them all and it's back to
the mountain's base.

## Running it

Just open `index.html` directly in a mobile browser, or serve the folder
locally:

```
cd wilfrid-game
python3 -m http.server 8000
```

Then visit `http://localhost:8000` on your phone (same network) or in a
mobile emulation view.
