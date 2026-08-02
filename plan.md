# CalBoost AI — Product & Technical Specification

> **Status:** Pre-development (MVP spec v1.0)
> **Last updated:** 2026-08-02
> **Owner:** Founding team
> **Platform:** iOS first, Android post-launch
> **Repo:** `CalBoost` — Expo SDK 54 scaffold, no product code yet

---

## Table of Contents

1. [Overview & Positioning](#1-overview--positioning)
2. [Target Audience & Personas](#2-target-audience--personas)
3. [Monetization Strategy](#3-monetization-strategy)
4. [User Flow](#4-user-flow)
5. [Onboarding Flow](#5-onboarding-flow)
6. [Design System & UX Philosophy](#6-design-system--ux-philosophy)
7. [Navigation & Route Map](#7-navigation--route-map)
8. [Screen Specifications](#8-screen-specifications)
9. [Feature Specifications](#9-feature-specifications)
10. [AI Food Analysis Flow](#10-ai-food-analysis-flow)
11. [Technical Stack](#11-technical-stack)
12. [Folder Structure](#12-folder-structure)
13. [Database & Convex Schema](#13-database--convex-schema)
14. [Clerk Auth Flow](#14-clerk-auth-flow)
15. [RevenueCat Integration](#15-revenuecat-integration)
16. [Notification Strategy](#16-notification-strategy)
17. [Gamification Strategy](#17-gamification-strategy)
18. [MVP Scope & Build Phases](#18-mvp-scope--build-phases)
19. [Future Features](#19-future-features)
20. [App Store Launch Plan](#20-app-store-launch-plan)
21. [Retention Strategy](#21-retention-strategy)
22. [Viral & Social Strategy](#22-viral--social-strategy)
23. [Architecture & Scalability](#23-architecture--scalability)
24. [Appendix: Critical Build Warnings](#24-appendix-critical-build-warnings)

---

## 1. Overview & Positioning

### Elevator pitch

**CalBoost AI is the calorie app for people who need to eat *more*.**

Every mainstream nutrition app — MyFitnessPal, Lose It!, Cal AI, Noom — is architected around subtraction. Their default framing is a deficit, their notifications warn you when you've eaten too much, and their onboarding assumes your goal is a smaller number on the scale. For the skinny 19-year-old who has been "trying to bulk" for eight months and hasn't moved a single kilogram, those apps are actively working against them.

CalBoost AI inverts the entire model. Snap a photo of your meal, the AI estimates the calories, and the app tells you how much **further you have to go today**. Streaks, XP, and daily nudges keep you eating on days when you don't feel hungry — which, for this audience, is the actual problem. Not knowledge. Not willpower. Consistency of intake.

### The wedge

> *"You're not skinny because of your genetics. You're skinny because you're not in a surplus."*

This single sentence is the product thesis, the marketing hook, and the retention mechanic. The app's job is to make the surplus **visible, achievable, and habitual**.

### Why this audience is underserved

| Problem | How incumbents fail | CalBoost AI's answer |
|---|---|---|
| "I eat a ton and still can't gain" | Deficit-first UX makes over-eating feel like failure | Surplus-first UX; unmet calories are the *problem to solve* |
| Logging is tedious, so they quit in 4 days | 8-field manual entry, barcode-first flows | Photo → 3 taps → logged |
| No idea what "enough" looks like | Generic macro calculators, no food guidance | Curated high-calorie food library with real numbers |
| Motivation collapses in week 2 | Charts only; no habit layer | Streaks, XP, daily tasks, forgiveness day |
| Advanced apps are intimidating | Periodization, RIR, macro cycling | Two numbers on the home screen: calories and protein |

### Non-goals (explicitly out of scope, forever or for a long time)

- ❌ **Complicated meal plans.** No 7-day rotating menus, no grocery lists, no recipe macros calculator. The Foods tab is *inspiration*, not prescription.
- ❌ **Bodybuilding depth.** No RIR, no mesocycles, no refeed protocols, no cutting mode at launch.
- ❌ **Perfect calorie accuracy.** ±15% is fine. Directional consistency beats false precision, and we say so in the UI.
- ❌ **A social network.** No feed, no comments, no DMs. Sharing is outbound-only (export a card to TikTok).
- ❌ **Micronutrient tracking.** Calories and protein are the two levers that matter for this user. Carbs/fat shown but never gated on.

### Success metric

**North star:** *Weekly Consistent Users* — users who hit ≥80% of their calorie goal on ≥5 of the last 7 days.

This single metric couples the thing the user wants (weight gain) with the thing the business wants (retention → renewal). It's also the number every notification, streak, and chart in the app is designed to move.

**Supporting targets for the first 90 days post-launch:**

| Metric | Target |
|---|---|
| Install → onboarding complete | ≥ 70% |
| Onboarding complete → trial start | ≥ 35% |
| Trial → paid conversion | ≥ 30% |
| D7 retention | ≥ 40% |
| D30 retention | ≥ 20% |
| AI scans per weekly active user | ≥ 8 |
| Annual plan share of new subs | ≥ 60% |

---

## 2. Target Audience & Personas

The audience is **skinny beginners who want to gain healthy weight**: students, gym beginners, and self-improvement-focused young adults, roughly **16–28**, skewing male (~75%) but explicitly not male-only. They are TikTok-native, price-sensitive but willing to pay for something that visibly works, and they have almost certainly already failed at this once.

### Persona 1 — "Rohan", 19, university student

- **Stats:** 172 cm, 54 kg, wants 65 kg. Eats two meals a day plus whatever's in the hostel canteen.
- **Belief:** "I have a fast metabolism, I eat like a horse."
- **Reality:** Averaging ~1,900 kcal against a ~2,900 kcal target. He has never counted.
- **Pain:** Feels genetically doomed. Embarrassed to be the thin one.
- **Current behavior:** Watched 40 hours of YouTube bulking content. Owns a tub of protein powder he uses twice a week.
- **Churn risk:** Logging feels like homework on top of coursework. **→ Photo scanning + 3 daily tasks must be under 60 seconds/day.**

### Persona 2 — "Marcus", 23, gym beginner at month 3

- **Stats:** 180 cm, 63 kg, wants 75 kg. Trains 4x/week, form is fine, progress is not.
- **Belief:** "My program must be wrong."
- **Reality:** Training is fine. He's eating at maintenance.
- **Pain:** Doing the hard part (the gym) and getting nothing back. Considering quitting.
- **Current behavior:** Tried MyFitnessPal, abandoned it in five days because everything about it assumed he wanted to lose weight.
- **Churn risk:** Wants proof it's working. **→ Weight trend chart + weekly summary must show signal within 14 days.**

### Persona 3 — "Aisha", 21, self-improvement focused

- **Stats:** 163 cm, 47 kg, wants 55 kg. Reads about habits, tracks other things already.
- **Belief:** "If I can make it a system, I can do it."
- **Reality:** Struggles with appetite; forgets to eat when busy.
- **Pain:** Wants to feel strong and healthy, not "thin." Turned off by bro-culture aesthetics.
- **Current behavior:** Uses a habit tracker, a journal app, and a step counter. Responds strongly to streaks.
- **Churn risk:** Will delete anything that feels aggressive, shaming, or male-gym-coded. **→ Design must stay clean and gender-neutral; copy must never shame.**

### Design implications from all three

1. **Time-to-log must be under 20 seconds** or Rohan quits.
2. **Evidence of progress must appear by day 14** or Marcus quits.
3. **Tone must be encouraging and never shaming** or Aisha quits.
4. All three have **failed at this before**. The app's emotional job is to make the user feel like *this time is different because the number is finally visible*.

---

## 3. Monetization Strategy

### Pricing

| Plan | Price | Trial | Effective |
|---|---|---|---|
| **Monthly** | **$8.99 / month** | 3 days free | $107.88 / yr |
| **Annual** | **$24.99 / year** | 3 days free | $2.08 / mo — **save 77%** |

The annual plan is deliberately, aggressively cheap relative to monthly. This is intentional:

- **Behavioral:** Weight gain takes months. A user on a monthly plan churns during their first plateau; an annual user rides it out and gets the result — which is also our best marketing asset.
- **Financial:** $24.99 upfront beats $8.99 followed by a month-2 cancellation, which is the modal monthly outcome in this category.
- **Operational:** Annual subscribers cut support and win-back cost dramatically.

**Target: ≥60% of new subscriptions on annual.** The paywall is designed around this — annual is pre-selected, badged, and framed as the default.

### Trial mechanics

- **3-day free trial**, then **auto-renewal** at the selected price unless cancelled before the period ends.
- **Trial reminder notification ~24h before charge** (day 2). This is required in some regions, mandatory-in-spirit everywhere, and — counter-intuitively — *raises* long-term retention by filtering out users who'd otherwise charge back or leave a 1-star review.
- Apple sends its own trial receipt; ours is a friendly in-app-branded heads-up, not a duplicate invoice.
- **Reminder copy:** *"Your free trial ends tomorrow. You've logged X days and Y meals — keep the streak alive."* (Value recap, not a warning.)

### Paywall placement — the single most important funnel decision

```
Onboarding Q1..Q8  →  🎯 PLAN REVEAL  →  💳 PAYWALL  →  trial starts  →  Home
```

The paywall appears **immediately after the plan reveal screen** and **before the user ever sees Home**. Rationale: the highest-intent second in the entire product is the moment the app says *"You need 3,140 calories and 118g of protein a day. At this rate you'll hit 65 kg by November 14."* The user has just invested 8 screens of effort and received a personalized, specific, credible answer. That is when you ask.

- **Hard gate**, but with a visible, non-dark-pattern dismissal (`✕` top-left, always tappable, no delay timer). Dismissing lands on a limited-mode Home with a persistent unlock bar. Dark patterns win a week of revenue and lose the App Store review.
- **Re-entry points:** the Home unlock bar, any premium feature tap, and Profile → Subscription.

### Entitlement model

- Single entitlement: **`premium`**
- RevenueCat offering: **`default`** → packages `$rc_monthly`, `$rc_annual`
- **Free (no trial / expired) tier:** view Foods library, log meals manually, log weight. Capped at 3 AI scans total.
- **Premium:** unlimited AI scans, all Progress charts, streak/XP system, all notifications, progress photos.

> **Server-side truth:** entitlement state is mirrored into Convex via the RevenueCat webhook. The client's `customerInfo` drives *UI* only; anything that costs money (AI scans) is authorized against the Convex record. See §15.

### Instrumentation

Every step below gets an event from day one — you cannot fix a funnel you cannot see:

`app_open` → `auth_started` → `auth_completed` (by method) → `onboarding_step_viewed` (per step) → `onboarding_completed` → `plan_revealed` → `paywall_viewed` → `paywall_plan_selected` → `trial_started` → `trial_reminder_sent` → `trial_converted` / `trial_cancelled` → `meal_logged` (by source) → `scan_started` / `scan_succeeded` / `scan_failed` → `weight_logged` → `streak_milestone` → `subscription_renewed` / `churned`

---

## 4. User Flow

### Primary flow (new user)

```
┌─────────────┐
│  App Launch │
└──────┬──────┘
       │
       ▼
  ┌─────────────────┐   signed in?
  │  Root gate      │──────────────┐
  │  (_layout.tsx)  │              │
  └────────┬────────┘              │
           │ no                    │ yes
           ▼                       ▼
   ┌───────────────┐      ┌──────────────────┐
   │  Welcome      │      │ onboarded?       │
   │  Sign in /up  │      └───┬──────────┬───┘
   └───────┬───────┘          │ no       │ yes
           │                  │          │
           │  Google / Apple  │          ▼
           │  Email+Password  │    ┌───────────┐   premium?
           ▼                  │    │  Tabs     │◄──── yes ──┐
   ┌───────────────┐          │    │  (Home)   │            │
   │  Account made │──────────┘    └───────────┘            │
   └───────┬───────┘                     ▲                  │
           ▼                             │ limited mode     │
   ┌─────────────────────────────┐       │                  │
   │  ONBOARDING (8 steps)       │       │                  │
   │  gender → height → weight   │       │                  │
   │  → target → activity → gym  │       │                  │
   │  → goal type → notifications│       │                  │
   └─────────────┬───────────────┘       │                  │
                 ▼                       │                  │
   ┌─────────────────────────────┐       │                  │
   │  🎯 PLAN REVEAL             │       │                  │
   │  calories · protein · date  │       │                  │
   └─────────────┬───────────────┘       │                  │
                 ▼                       │                  │
   ┌─────────────────────────────┐       │                  │
   │  💳 PAYWALL                 │───────┴──────────────────┘
   │  annual (default) / monthly │  dismiss        purchase
   └─────────────────────────────┘
```

### Core daily loop (the flow that must be frictionless)

```
Notification "You still need 800 calories today"
        │
        ▼
   Home → tap Scan (FAB)
        │
        ▼
   Camera → shutter
        │
        ▼
   Analyzing… (2–5s)
        │
        ▼
   Review sheet → adjust portion → Add to today
        │
        ▼
   Home: ring animates up, XP +10, task ticked
        │
        └──► (goal reached) → streak +1, celebration, Day N completed
```

### Secondary flows

| Flow | Path |
|---|---|
| Log from library | Home/Foods → Foods tab → category → food card → **Add to today** |
| Manual entry | Home → `+` → Manual add → name/kcal/protein → Save |
| Log weight | Progress → **Log weight** → stepper → Save (or Home weight card) |
| Change goal | Profile → Goals → edit → recalculates plan → confirm |
| Returning user, subscription expired | Launch → Tabs in limited mode + unlock bar → Paywall |
| Signed out | Launch → Welcome |
| Restore purchase | Paywall or Profile → **Restore purchases** |
| Delete account | Profile → Account → Delete → confirm twice → Clerk delete + Convex purge |

---

## 5. Onboarding Flow

### Principles

1. **One question per screen.** No forms. No screen asks two things.
2. **Tap over type.** Pickers, steppers, and cards everywhere; the keyboard appears at most once (target weight, optionally).
3. **Progress must be visible.** A thin top progress bar, `Step 3 of 8`, and a back arrow that always works.
4. **Every screen is answerable in under 3 seconds.** Sensible defaults are pre-selected based on prior answers.
5. **Nothing is written to the server until the end.** All answers live in a client draft store; one Convex mutation fires at plan reveal. A drop-off at step 5 costs us nothing and creates no orphan records.
6. **It should feel like a diagnosis, not a form.** Each answer subtly implies the app is building something specific for *you*.

### Step-by-step

| # | Question | Input | Notes |
|---|---|---|---|
| 1 | What's your gender? | 3 large cards: Male / Female / Prefer not to say | Affects BMR. "Prefer not to say" uses an average constant. |
| 2 | How tall are you? | Vertical ruler picker + unit toggle (cm / ft-in) | Default 170 cm. Haptic tick on each unit. |
| 3 | What's your current weight? | Horizontal ruler picker + toggle (kg / lb) | Default 60 kg. |
| 4 | What's your target weight? | Ruler picker, **pre-set to current + 8 kg** | Validate target > current. If target ≤ current: "CalBoost is built for gaining weight — set a target above your current weight." |
| 5 | How active are you? | 4 cards: Sedentary / Lightly active / Active / Very active | Each card carries a plain-language example ("Desk job, little exercise"). |
| 6 | Gym experience? | 3 cards: Never trained / Under 1 year / Over 1 year | Used for tone, protein target nudge, and future workout features. |
| 7 | Pick your pace | 2 cards: **Lean Bulk** (+300 kcal, ~0.25 kg/wk, minimal fat gain) / **Aggressive Bulk** (+600 kcal, ~0.5 kg/wk, faster, some fat gain) | Lean pre-selected. Show the tradeoff honestly. |
| 8 | Stay consistent | Notification opt-in with 3 example notification previews + reminder time picker | Native permission prompt fires **only** after the user taps "Enable reminders" — never cold. |

### Plan reveal (step 9 — the money screen)

Not a question. A calculated, animated result:

```
        Your daily target

        ╭──────────────────╮
        │                  │
        │      3,140       │   ← counts up from 0 over 800ms
        │    calories      │
        │                  │
        ╰──────────────────╯

    ┌──────────┐  ┌──────────────┐
    │ 118 g    │  │  65 kg by    │
    │ protein  │  │  Nov 14      │
    └──────────┘  └──────────────┘

   Based on your 172cm / 54kg starting point,
   lightly active, lean bulk.

   ┌────────────────────────────────┐
   │      Start my 3-day trial      │
   └────────────────────────────────┘
```

Sequence: number counts up → protein and timeline cards fade in staggered → CTA slides up. Roughly 1.5s total. This screen is worth the animation budget; it's the moment the user decides.

### The math (implement in `lib/nutrition.ts`, pure functions, unit-tested)

**Step 1 — BMR, Mifflin-St Jeor:**

```
male:    BMR = 10·kg + 6.25·cm − 5·age + 5
female:  BMR = 10·kg + 6.25·cm − 5·age − 161
neutral: BMR = 10·kg + 6.25·cm − 5·age − 78   (average of the two constants)
```

> **Age:** not asked in the 8 steps, to keep onboarding short. Default to **22** (the audience median) and expose an optional age field in Profile → Goals for users who want a more accurate number. Revisit if plan accuracy complaints appear.

**Step 2 — TDEE:**

| Activity | Multiplier |
|---|---|
| Sedentary | 1.2 |
| Lightly active | 1.375 |
| Active | 1.55 |
| Very active | 1.725 |

`TDEE = BMR × multiplier`

**Step 3 — Calorie goal:**

```
lean bulk:        calorieGoal = TDEE + 300
aggressive bulk:  calorieGoal = TDEE + 600
```
Round to the nearest 10. Clamp to a floor of 1,800 kcal.

**Step 4 — Protein goal:**

```
lean bulk:        1.6 g × bodyweight(kg)
aggressive bulk:  2.0 g × bodyweight(kg)
```
`+0.1 g/kg` if gym experience is "over 1 year". Round to nearest 5 g. Clamp to 80–220 g.

**Step 5 — Timeline:**

```
weeklyRate = 0.25 kg (lean) | 0.5 kg (aggressive)
weeks      = ceil((targetKg − currentKg) / weeklyRate)
targetDate = today + weeks × 7 days
```
Display as a month + day ("Nov 14"). If `weeks > 78`, cap the display at "~18 months" and suggest aggressive bulk instead of showing an absurd date.

**Step 6 — Recalculation:** goals recompute whenever weight, target, activity, pace, or age changes. Weight-driven recalculation runs **automatically but silently** whenever a new weight log moves bodyweight by ≥2 kg from the last calculation basis, surfaced as a Home card: *"You've gained 2 kg — your target is now 3,220 calories."* This is a retention moment, not a settings chore.

**Units:** always store metric (kg, cm) in Convex. Convert only at the display boundary via `lib/units.ts`. Never store an imperial value.

---

## 6. Design System & UX Philosophy

> **⚠️ Design source of truth:** the `/design` folder holds the visual reference images for this app. **Every screen must visually match those references** — layout, spacing, component styling, visual hierarchy, and overall aesthetic. The tokens below are the *starting* system; when the reference images land, the first task is to extract their exact values into `constants/theme.ts` (see Reconciliation, below).

### UX philosophy

1. **Light mode first.** Ship light mode polished. Dark mode is post-MVP, and the token architecture makes it a swap, not a rewrite.
2. **One primary action per screen.** Every screen has exactly one thing it wants you to do, and that thing is the largest, highest-contrast element on it.
3. **Two numbers, not twelve.** Calories and protein own the home screen. Carbs and fat exist but never compete for attention.
4. **Thumb-first.** Primary actions live in the bottom third. Nothing critical in the top corners except back/close.
5. **Motion is feedback, never decoration.** Rings fill, numbers count, XP bars slide — all in response to a user action, all under 400ms except the plan reveal.
6. **Never shame the user.** A missed day is a "reset", not a "failure". Under-eating gets *"600 to go — a shake covers it"*, never *"you failed today"*. This is a hard rule and it applies to every string in `constants/copy.ts`.
7. **Estimates are labelled as estimates.** Honesty about AI accuracy builds more trust than false precision, and it pre-empts the "this is wrong" review.
8. **Empty states teach.** Every empty state names the one action that fills it.
9. **No dead ends.** Every error state offers a next step (retry, manual entry, contact).
10. **Respect the 60-second budget.** The complete daily loop — open, scan, confirm, close — must be doable in under a minute.

### Visual direction

Minimalistic · clean · premium · modern 2026 startup aesthetic · generous whitespace · soft rounded corners · simple typography · visually motivating without clutter · fitness/self-improvement rather than gym-bro.

### Tokens — `constants/theme.ts`

Single source of truth, mirrored into `tailwind.config.js` so NativeWind classes and any imperative styles cannot drift apart.

```ts
export const colors = {
  // Surfaces
  bg:            '#FFFFFF',
  surface:       '#F7F7F8',
  surfaceRaised: '#FFFFFF',
  border:        '#ECECEF',
  overlay:       'rgba(11,11,15,0.45)',

  // Ink
  ink:           '#0B0B0F',
  inkMuted:      '#6B6B76',
  inkSubtle:     '#9C9CA6',
  inkInverse:    '#FFFFFF',

  // Brand — "surplus orange": energy, appetite, warmth
  primary:       '#FF5A1F',
  primaryPress:  '#E64A12',
  primarySoft:   '#FFF1EB',

  // Semantic
  protein:       '#16A34A',
  proteinSoft:   '#EAF7EF',
  carbs:         '#F59E0B',
  fat:           '#8B5CF6',
  streak:        '#FF9500',
  xp:            '#3B82F6',
  danger:        '#DC2626',
  success:       '#16A34A',
} as const;

export const radius  = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, pill: 999 } as const;
export const space   = { 0:0, 1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 7:32, 8:40, 9:48, 10:64 } as const;

export const type = {
  display: { size: 40, weight: '700', tracking: -1.2, leading: 44 }, // plan reveal, ring number
  h1:      { size: 28, weight: '700', tracking: -0.6, leading: 34 }, // screen titles
  h2:      { size: 22, weight: '600', tracking: -0.4, leading: 28 }, // section titles
  h3:      { size: 17, weight: '600', tracking: -0.2, leading: 22 }, // card titles
  body:    { size: 15, weight: '400', tracking: 0,    leading: 22 },
  label:   { size: 13, weight: '500', tracking: 0,    leading: 18 },
  caption: { size: 11, weight: '500', tracking: 0.2,  leading: 14 },
} as const;

export const shadow = {
  // Soft, low-opacity, large-radius. Never harsh.
  card:  { shadowColor:'#0B0B0F', shadowOpacity:0.04, shadowRadius:12, shadowOffset:{width:0,height:2}, elevation:2 },
  float: { shadowColor:'#0B0B0F', shadowOpacity:0.10, shadowRadius:20, shadowOffset:{width:0,height:6}, elevation:6 },
} as const;

export const motion = { fast: 150, base: 250, slow: 400, reveal: 800 } as const;
```

**Typography:** `Inter` (variable) loaded via `expo-font`, with SF Pro as the iOS fallback. One family only. Weights 400/500/600/700.

**Iconography:** `@expo/vector-icons` (already installed) — Feather/Ionicons for UI chrome. Consistent 1.5px stroke weight. Emoji only in notification copy and celebration moments, never as UI icons.

**Layout constants:** screen padding `space[5]` (20px) · card padding `space[4]` (16px) · card gap `space[3]` (12px) · section gap `space[6]` (24px) · min touch target 44×44.

### Component inventory — `components/ui/`

| Component | Purpose | Key props |
|---|---|---|
| `Screen` | Safe-area wrapper + scroll + consistent padding | `scroll`, `edges`, `footer` |
| `Card` | The base surface for everything | `variant: 'flat'\|'raised'`, `onPress` |
| `Button` | Primary / secondary / ghost / danger | `variant`, `size`, `loading`, `icon`, `disabled` |
| `ProgressRing` | Calorie ring — SVG + Reanimated | `value`, `goal`, `size`, `strokeWidth`, `color`, `label` |
| `ProgressBar` | Protein, XP | `value`, `goal`, `color`, `height` |
| `StatTile` | Small labelled number | `label`, `value`, `unit`, `icon`, `tone` |
| `SegmentedControl` | kg/lb, week/month, monthly/annual | `options`, `value`, `onChange` |
| `RulerPicker` | Onboarding height/weight, weight logging | `min`, `max`, `step`, `unit`, `orientation` |
| `OptionCard` | Onboarding single-select cards | `title`, `subtitle`, `icon`, `selected` |
| `Sheet` | Bottom sheet for scan review, quick add | `visible`, `onClose`, `snapPoints` |
| `FoodCard` | Foods grid item | `food`, `onPress`, `onQuickAdd` |
| `MealRow` | A logged meal on Home | `meal`, `onPress`, `onDelete` |
| `StreakDots` | 7-day streak strip | `days` |
| `XPBar` | Level + XP progress | `level`, `xp`, `nextLevelXp` |
| `TaskItem` | Daily task checkbox row | `task`, `done`, `onToggle` |
| `Chip` | Category filter | `label`, `selected`, `onPress` |
| `EmptyState` | Icon + headline + body + CTA | `icon`, `title`, `body`, `action` |
| `Skeleton` | Shimmer placeholder | `width`, `height`, `radius` |
| `Toast` | Transient confirmation | `message`, `tone` |
| `PaywallGate` | Wraps premium content, renders unlock prompt | `feature`, `children` |

**Rule:** screens compose these primitives and contain **no raw color or spacing literals**. If a screen needs a new visual treatment, it becomes a primitive first. This is what makes the `/design` reconciliation cheap.

### Reconciliation with `/design` (do this before Phase 0 UI work)

1. Sample exact hex values from the reference images → replace the `colors` block.
2. Measure paddings, gaps, corner radii, and card heights → replace `space` / `radius`.
3. Identify the type ramp (count distinct text sizes in the references) → replace `type`.
4. Identify the primary button style, card style, and tab bar treatment → update `Button`, `Card`, and the tabs layout only.
5. Rebuild the Home screen first and diff it side-by-side against the reference image.

Because screens only ever consume primitives and tokens, steps 1–4 change the entire app's look without touching a single screen file.

### Accessibility (non-negotiable baseline)

- Every interactive element has an `accessibilityLabel` and `accessibilityRole`.
- Body text ≥15px; contrast ≥4.5:1 for text, ≥3:1 for UI elements. `inkSubtle` is for decorative text only.
- Respect `prefers-reduced-motion`: skip count-ups and ring animations, jump to final state.
- Support Dynamic Type up to ~130% without clipping — no fixed-height text containers.
- Never encode meaning in color alone (protein bar also has a numeric label).

---

## 7. Navigation & Route Map

**Exactly 4 bottom tabs.** No more, ever. Everything else is a modal, a stack push, or a sheet.

```
🏠 Home        🍽 Foods        📈 Progress        👤 Profile
```

### `expo-router` route table

| Route | File | Type | Auth |
|---|---|---|---|
| `/` | `app/index.tsx` | Redirect gate | — |
| `/welcome` | `app/(auth)/welcome.tsx` | Screen | Public |
| `/sign-in` | `app/(auth)/sign-in.tsx` | Screen | Public |
| `/sign-up` | `app/(auth)/sign-up.tsx` | Screen | Public |
| `/verify` | `app/(auth)/verify.tsx` | Screen | Public |
| `/onboarding/gender` | `app/(onboarding)/gender.tsx` | Screen | Signed in |
| `/onboarding/height` | `app/(onboarding)/height.tsx` | Screen | Signed in |
| `/onboarding/weight` | `app/(onboarding)/weight.tsx` | Screen | Signed in |
| `/onboarding/target` | `app/(onboarding)/target.tsx` | Screen | Signed in |
| `/onboarding/activity` | `app/(onboarding)/activity.tsx` | Screen | Signed in |
| `/onboarding/experience` | `app/(onboarding)/experience.tsx` | Screen | Signed in |
| `/onboarding/pace` | `app/(onboarding)/pace.tsx` | Screen | Signed in |
| `/onboarding/reminders` | `app/(onboarding)/reminders.tsx` | Screen | Signed in |
| `/onboarding/plan` | `app/(onboarding)/plan.tsx` | Screen | Signed in |
| `/(tabs)` | `app/(tabs)/index.tsx` | **Home tab** | Onboarded |
| `/(tabs)/foods` | `app/(tabs)/foods.tsx` | **Foods tab** | Onboarded |
| `/(tabs)/progress` | `app/(tabs)/progress.tsx` | **Progress tab** | Onboarded |
| `/(tabs)/profile` | `app/(tabs)/profile.tsx` | **Profile tab** | Onboarded |
| `/food/[id]` | `app/food/[id].tsx` | Push | Onboarded |
| `/scan` | `app/scan/index.tsx` | Full-screen modal | Onboarded + premium |
| `/scan/review` | `app/scan/review.tsx` | Sheet-style modal | Onboarded + premium |
| `/meal/add` | `app/meal/add.tsx` | Modal | Onboarded |
| `/meal/[id]` | `app/meal/[id].tsx` | Modal (edit) | Onboarded |
| `/weight/log` | `app/weight/log.tsx` | Modal | Onboarded |
| `/paywall` | `app/paywall.tsx` | Full-screen modal | Signed in |
| `/settings/goals` | `app/settings/goals.tsx` | Push | Onboarded |
| `/settings/reminders` | `app/settings/reminders.tsx` | Push | Onboarded |
| `/settings/notifications` | `app/settings/notifications.tsx` | Push | Onboarded |
| `/settings/account` | `app/settings/account.tsx` | Push | Onboarded |
| `/settings/units` | `app/settings/units.tsx` | Push | Onboarded |

### Gating logic (`app/_layout.tsx` + `app/index.tsx`)

```
isLoaded === false            → splash / null (keep native splash up)
!isSignedIn                   → redirect /welcome
isSignedIn && !user.onboarded  → redirect /onboarding/gender
isSignedIn && user.onboarded   → redirect /(tabs)
```

Premium gating is **not** a route redirect — it's the `PaywallGate` component wrapping content in place. Rationale: bouncing a paying-but-lapsed user out of their own data feels punitive and generates refund requests. They keep read access to their history; they lose the AI scans and charts.

Tab bar: 4 icons + labels, `primary` tint when active, hairline top border, hidden on all modals and full-screen routes.

---

## 8. Screen Specifications

Each screen below is spec'd with the same eight parts: **Purpose · UI sections · Components · User actions · States · CTAs · Empty state · Loading state**.

---

### 8.1 Welcome

- **Purpose:** Convert a cold install into a signed-in user in under 15 seconds. Establish premium feel immediately.
- **UI sections:** (1) Hero visual — a clean, aspirational image or subtle animated calorie ring; (2) Wordmark "CalBoost AI"; (3) Headline: *"Eat enough. Finally gain weight."*; (4) Sub: *"AI calorie tracking built for people trying to bulk up."*; (5) Auth button stack; (6) Legal footnote.
- **Components:** `Screen`, `Button` (primary + 2 social), `Text`.
- **User actions:** Continue with Apple · Continue with Google · Continue with email · "Already have an account? Sign in" · tap Terms/Privacy.
- **States:** `idle` · `authenticating` (button spinner, other buttons disabled) · `error` (inline banner above the stack) · `cancelled` (silent return to idle — user backing out of a social sheet is not an error).
- **CTAs:** **Continue with Apple** (primary on iOS, per platform convention) · Continue with Google · Continue with email.
- **Empty state:** N/A.
- **Loading state:** Native splash held until Clerk `isLoaded`; then the screen fades in. No spinner-on-white flash.

---

### 8.2 Sign up / Sign in (email + password)

- **Purpose:** Email/password path for users who don't want social auth.
- **UI sections:** Back button · title · email field · password field (with reveal toggle) · inline validation · submit · "or" divider · social buttons · switch-mode link · forgot-password link (sign-in only).
- **Components:** `Screen`, `TextInput`, `Button`, inline `ErrorText`.
- **User actions:** Type email/password · toggle visibility · submit · switch to social · switch sign-in/sign-up · forgot password.
- **States:** `idle` · `validating` (inline, on blur) · `submitting` · `error` — mapped from Clerk error codes to human copy (`form_password_pwned` → *"That password has appeared in a data breach. Try another."*; `form_identifier_exists` → *"You already have an account — sign in instead."* with a one-tap switch) · `needs_verification` → push `/verify`.
- **CTAs:** **Create account** / **Sign in**.
- **Empty state:** N/A — submit disabled until both fields pass basic validation.
- **Loading state:** Button spinner, fields locked, keyboard retained.

---

### 8.3 Verify email

- **Purpose:** Complete Clerk's email code verification.
- **UI sections:** Title *"Check your email"* · the address, with an edit affordance · 6-digit code input · resend link with cooldown · submit.
- **Components:** `Screen`, `OtpInput` (6 cells), `Button`, `CountdownLink`.
- **User actions:** Enter code (auto-submits on 6th digit) · paste code · resend (30s cooldown) · change email (returns to sign-up).
- **States:** `idle` · `submitting` · `invalid_code` (cells shake, error text, cells clear) · `expired` (prompt resend) · `success` → onboarding.
- **CTAs:** **Verify** (auto-fires) · Resend code.
- **Empty state:** N/A.
- **Loading state:** Cells dim + inline spinner.

---

### 8.4 Onboarding steps 1–8

- **Purpose:** Collect the seven data points needed to compute a credible plan, while building the feeling that something is being built for *you*.
- **UI sections:** (1) Top bar — back arrow, progress bar, `Step N of 8`; (2) Question headline (h1, left-aligned, 2 lines max); (3) optional one-line helper; (4) Input zone (cards / ruler picker); (5) Bottom-docked Continue button.
- **Components:** `Screen`, `ProgressBar`, `OptionCard`, `RulerPicker`, `SegmentedControl` (units), `Button`.
- **User actions:** Select an option (selecting a single-choice card **auto-advances after 200ms** — no double tap needed) · scrub the ruler (haptic tick per step) · toggle units · Continue · Back.
- **States:** `idle` · `selected` · `invalid` (only step 4: target ≤ current → inline message, Continue disabled) · `advancing` (200ms transition lock so a double-tap can't skip a screen).
- **CTAs:** **Continue** (ruler steps) · card tap itself is the CTA on select steps.
- **Empty state:** N/A — every step has a default pre-selected.
- **Loading state:** None. All local. Zero network. This is why onboarding feels fast.

---

### 8.5 Onboarding — notification opt-in (step 8)

- **Purpose:** Earn the notification permission instead of asking cold. Push permission is the single highest-leverage retention asset in the app and you get exactly one shot at it.
- **UI sections:** Headline *"Stay consistent"* · 3 mock notification previews styled as real iOS banners (*"You still need 800 calories today"*, *"Day 17 completed 🔥"*, *"Time to drink your shake"*) · reminder time picker (default 9:00 AM, 1:00 PM, 8:00 PM) · Enable button · skip link.
- **Components:** `Screen`, `NotificationPreview`, `TimePicker`, `Button`.
- **User actions:** Adjust reminder times · **Enable reminders** (this is what triggers the native OS prompt) · "Not now".
- **States:** `idle` · `requesting` (OS sheet up) · `granted` · `denied` (persist the preference, continue without complaint, re-offer later from Profile).
- **CTAs:** **Enable reminders** · Not now.
- **Empty state:** N/A.
- **Loading state:** None.

---

### 8.6 Plan reveal

- **Purpose:** Deliver the personalized result and hand off to the paywall at peak intent.
- **UI sections:** (1) Eyebrow *"Your daily target"*; (2) Big calorie number in a ring/card; (3) Two stat tiles — protein goal, target date; (4) One-line "based on…" derivation summary (builds credibility); (5) Optional third tile: weekly gain rate; (6) Primary CTA; (7) Small print: *"You can change this any time."*
- **Components:** `Screen`, `AnimatedNumber`, `ProgressRing` (decorative), `StatTile`, `Button`.
- **User actions:** Tap the primary CTA · tap the derivation line to expand the full breakdown (BMR → TDEE → surplus) for the curious.
- **States:** `revealing` (staggered animation, CTA disabled ~1.2s so it isn't tapped mid-reveal) · `revealed` · `saving` (the single Convex mutation writing profile + goals) · `error` (retry, draft preserved — never lose 8 screens of input).
- **CTAs:** **Start my 3-day trial** → `/paywall`.
- **Empty state:** N/A.
- **Loading state:** Skeleton is unnecessary — the animation *is* the loading state. The Convex write happens behind the CTA tap, not before the reveal.

---

### 8.7 Home (tab 1) — the most important screen in the app

- **Purpose:** Answer one question in under one second — *"how much more do I need to eat today?"* — and make logging the next meal effortless.
- **UI sections (top to bottom):**
  1. **Header** — greeting + date; streak pill top-right (`🔥 17`).
  2. **Calorie ring card** — big `ProgressRing`; center shows **calories remaining** (the actionable number) with consumed/goal beneath; ring turns `success` green at 100%, and keeps filling past 100% rather than capping (over-eating is *good* here — a distinguishing detail vs. every deficit app).
  3. **Protein bar** — `112 / 118 g` with a green fill.
  4. **Secondary macro row** — carbs / fat, small, muted, non-judgmental.
  5. **Motivational line** — rotates daily from `constants/copy.ts` (*"Consistency beats motivation."*).
  6. **Quick actions row** — **Scan meal** (primary, prominent) · Add manually · From library.
  7. **Daily tasks card** — 3 checkable tasks (see §17), auto-ticked by real activity.
  8. **Today's meals** — `MealRow` list with thumbnail, name, kcal, protein; swipe to delete; tap to edit.
  9. **Weight card** — current weight, Δ since start, mini sparkline, **Log weight** action.
  10. **XP bar** — level + progress to next level.
- **Components:** `Screen`, `ProgressRing`, `ProgressBar`, `StatTile`, `Button`, `TaskItem`, `MealRow`, `StreakDots`, `XPBar`, `Sparkline`, `EmptyState`, `Skeleton`.
- **User actions:** Pull to refresh · tap Scan (→ `/scan`) · Add manually (→ `/meal/add`) · From library (→ Foods tab) · tap a meal (→ edit) · swipe a meal (delete, with undo toast) · toggle a task · tap Log weight · tap the streak pill (→ Progress) · tap the XP bar (→ level detail sheet).
- **States:**
  - `loading` — skeleton ring + tiles.
  - `empty_day` — ring at 0, meals list replaced by empty state.
  - `in_progress` — the normal case.
  - `goal_hit` — ring green, confetti burst **once** per day, streak increments, `Day N completed` banner.
  - `over_goal` — ring past 100% in green with a *"Surplus — that's the point 💪"* label. **Never red. Never a warning.**
  - `limited_mode` (no premium) — sticky unlock bar below the header; charts and scan CTA show `PaywallGate`.
  - `offline` — cached Convex data with a subtle offline chip; writes queue via Convex's built-in behavior.
  - `stale_day` (app opened after midnight) — auto-roll to the new day, no manual refresh.
- **CTAs:** **Scan meal** (primary) · Add manually · Log weight.
- **Empty state:** Ring at 0 with *"Let's fill this up."* → *"Scan your first meal and we'll do the math."* → **Scan meal** button. Below: *"Not near food? Browse high-calorie ideas →"*.
- **Loading state:** Skeleton ring (circle shimmer) + 2 tile shimmers + 3 row shimmers. Never a centered spinner on a blank screen — the layout should be recognizable before the data lands.

---

### 8.8 Foods (tab 2)

- **Purpose:** Solve *"what do I even eat to hit 3,000 calories?"* with concrete, high-calorie, low-effort options — and let the user log one in two taps.
- **UI sections:** (1) Title + search field; (2) Category chip row — **Breakfast · Lunch · Dinner · Snacks · Shakes** (horizontally scrollable, "All" first); (3) Optional "Highest calorie" / "Highest protein" sort toggle; (4) 2-column grid of `FoodCard`s — thumbnail image, name, **kcal badge**, **protein badge**, and a `+` quick-add; (5) Sticky "Added to today" toast.
- **Components:** `Screen`, `SearchInput`, `Chip`, `FoodCard`, `SegmentedControl`, `Toast`, `EmptyState`, `Skeleton`.
- **User actions:** Search (debounced 250ms) · select a category · sort · tap a card (→ `/food/[id]`) · tap `+` (log immediately with default serving, haptic + toast + undo) · pull to refresh.
- **States:** `loading` · `loaded` · `filtered` · `searching` · `no_results` · `offline` (cached list; images from `expo-image` disk cache) · `adding` (per-card spinner on the `+`).
- **CTAs:** **+** quick-add per card · **Add to today** on detail.
- **Empty state:** Search with no results → *"No foods match "X"."* + *"Try 'shake' or 'peanut butter'"* + **Clear search**. Category empty (shouldn't happen with a seeded table, but handle it) → *"Nothing here yet — check back soon."*
- **Loading state:** 6 `FoodCard` skeletons in the grid, chips rendered immediately (they're static).

---

### 8.9 Food detail

- **Purpose:** Give enough detail to decide, then log it.
- **UI sections:** (1) Large hero image; (2) Name + category chip; (3) Macro row — calories (large), protein, carbs, fat; (4) Quick description (1–2 sentences, why it's good for bulking); (5) Serving stepper (0.5× / 1× / 1.5× / 2× or a numeric multiplier) with macros that live-update; (6) Meal-type selector (breakfast/lunch/dinner/snack) defaulted by time of day; (7) Bottom-docked Add button.
- **Components:** `Screen`, `Image` (`expo-image`), `StatTile`, `SegmentedControl`, `Stepper`, `Button`.
- **User actions:** Change serving multiplier · change meal type · **Add to today** · share · back.
- **States:** `loading` · `loaded` · `adding` · `added` (button morphs to a checkmark for 800ms, then auto-dismiss to the previous screen) · `error`.
- **CTAs:** **Add to today · 640 cal** (the button label carries the number — it makes the consequence explicit).
- **Empty state:** N/A. If a food id is missing → *"This food is no longer available"* + back.
- **Loading state:** Image shimmer + text-line shimmers; the button renders disabled immediately so layout doesn't jump.

---

### 8.10 Scan — camera

- **Purpose:** Capture a meal photo with zero friction. This screen is the product's signature interaction.
- **UI sections:** (1) Full-bleed `CameraView`; (2) Top bar — close `✕`, flash toggle; (3) Center framing guide with the hint *"Fit your whole plate in frame"*; (4) Bottom bar — library picker (thumbnail of last photo), **large shutter**, and a "type it instead" link; (5) First-run coach overlay (shown once).
- **Components:** `CameraView` (`expo-camera`), `ShutterButton`, `IconButton`, `CoachOverlay`.
- **User actions:** Grant permission · tap shutter · pick from library (`expo-image-picker`) · toggle flash · close · fall back to manual entry.
- **States:**
  - `permission_undetermined` — rationale card explaining *why* before triggering the OS prompt.
  - `permission_denied` — *"Camera access is off."* + **Open Settings** (`Linking.openSettings()`) + **Type it instead**.
  - `ready` · `capturing` (shutter scales down, flash-white overlay) · `processing` (immediate hand-off to review with the analyzing state, so the camera never appears frozen).
  - `scan_limit_reached` (free tier, 3 scans used) → `PaywallGate` overlay.
  - `camera_unavailable` (simulator/hardware failure) → fall back to library picker + manual entry.
- **CTAs:** **Shutter** · Choose from library · Type it instead.
- **Empty state:** N/A.
- **Loading state:** Black frame with a centered logo mark while the camera initializes (~300ms) — never a white flash.

---

### 8.11 Scan — analyzing & review

- **Purpose:** Turn an AI estimate into a confirmed, corrected log entry. The user must feel in control of the number.
- **UI sections (analyzing):** The captured photo, dimmed and slightly scaled · a progress indicator · a 3-stage rotating label: *"Looking at your plate…"* → *"Identifying foods…"* → *"Estimating calories…"* · Cancel.
- **UI sections (review):** (1) Photo thumbnail; (2) Editable meal name (AI-suggested); (3) **Calories** — large, tappable to edit; (4) Protein / carbs / fat row, each tappable; (5) Detected items list, each removable (*"Chicken thigh · 320 cal"*); (6) Portion multiplier `0.5× / 1× / 1.5× / 2×` re-scaling everything live; (7) Meal type selector; (8) Confidence + disclaimer line: *"AI estimate — tap any number to adjust."*; (9) Bottom-docked Add button.
- **Components:** `Sheet`, `Image`, `EditableNumber`, `SegmentedControl`, `ItemRow`, `Button`, `Toast`.
- **User actions:** Cancel during analysis · edit name · edit any macro inline · remove a detected item (macros recalculate) · change the multiplier · change meal type · **Add to today** · Retake.
- **States:**
  - `analyzing` (2–5s target).
  - `success` — review sheet populated.
  - `low_confidence` — same sheet with a highlighted banner: *"Not fully sure about this one — double-check the numbers."*
  - `no_food_detected` — *"Couldn't find food in that photo."* + **Retake** + **Enter manually**.
  - `timeout` (>15s) — *"That took too long."* + **Try again** + **Enter manually**.
  - `network_error` — retry (the photo is retained; a user should never have to re-shoot because of our network).
  - `rate_limited` — *"You've hit today's scan limit. Resets at midnight."*
  - `saving` → `saved` (dismiss, Home ring animates up).
- **CTAs:** **Add to today · 1,240 cal** · Retake · Enter manually.
- **Empty state:** N/A.
- **Loading state:** The analyzing state above — a real, narrated progress sequence rather than an indeterminate spinner. Perceived speed matters more than actual speed here.

---

### 8.12 Manual meal add / edit

- **Purpose:** The always-works escape hatch. Never let a user be unable to log something.
- **UI sections:** Title · name field · calories field (numeric, autofocused) · protein field · optional carbs/fat (collapsed behind "Add carbs & fat") · meal type selector · recent-meals shortcut list (*"Log again"* from the last 7 days) · Save.
- **Components:** `Screen`/`Sheet`, `TextInput`, `NumericInput`, `SegmentedControl`, `MealRow`, `Button`.
- **User actions:** Type values · tap a recent meal to prefill · expand optional macros · Save · Delete (edit mode only, with confirm).
- **States:** `idle` · `invalid` (calories required, 1–10,000) · `saving` · `saved` · `error`.
- **CTAs:** **Save meal** · Delete meal (edit mode, danger variant).
- **Empty state:** No recent meals → hide the section entirely rather than showing an empty shell.
- **Loading state:** Recents shimmer (3 rows); the form is interactive immediately — the form never waits on the network.

---

### 8.13 Progress (tab 3)

- **Purpose:** Prove it's working. This is the retention screen and the churn-prevention screen.
- **UI sections:**
  1. **Header stats row** — current weight · total gained (`+3.2 kg`) · days tracked.
  2. **Weight chart** — line chart with a dashed goal line, range toggle (`1M / 3M / 6M / All`), and a 7-day moving average overlay so daily water-weight noise doesn't read as failure.
  3. **Streak calendar** — month heatmap; each day tinted by % of calorie goal hit; today outlined; forgiveness days marked distinctly.
  4. **Calorie consistency** — 7-day bar chart with the goal line overlaid; a *"5 of 7 days hit"* summary.
  5. **Weekly summary card** — avg calories, avg protein, days hit, weight Δ, and a one-line verdict (*"Strong week — you're on pace."*).
  6. **Transformation tracking** — progress photos grid + **Add photo**; side-by-side compare of first vs. latest.
  7. **Milestones** — earned badges timeline.
- **Components:** `Screen`, `LineChart` / `BarChart` (`react-native-gifted-charts`), `CalendarHeatmap`, `SegmentedControl`, `StatTile`, `Card`, `PhotoGrid`, `EmptyState`, `Skeleton`, `PaywallGate`.
- **User actions:** Switch chart range · scrub the chart (tooltip with date + value) · tap a calendar day (day-detail sheet) · **Log weight** · add/compare progress photos · share a summary card.
- **States:** `loading` · `insufficient_data` (<2 weight entries → chart replaced by an encouraging prompt) · `loaded` · `limited_mode` (charts blurred behind `PaywallGate`, header stats still visible — show enough to create the want) · `offline`.
- **CTAs:** **Log weight** (primary) · Add photo · Share progress.
- **Empty state:** No weight logs → *"Log your weight to start tracking."* + *"Weigh yourself in the morning, before eating, for the most consistent numbers."* + **Log weight**. No photos → *"Add your first progress photo — future you will want this."*
- **Loading state:** Chart-shaped skeleton (rectangle with axis lines) + stat tile shimmers. Charts must never pop in from zero height and shove content down.

---

### 8.14 Weight log

- **Purpose:** Log a weight in under 5 seconds.
- **UI sections:** Date (defaults today, editable) · large `RulerPicker` pre-set to the last logged weight · unit toggle · optional note · optional "attach photo" · Save.
- **Components:** `Sheet`, `RulerPicker`, `SegmentedControl`, `TextInput`, `Button`.
- **User actions:** Scrub the picker (haptic ticks) · change date · change units · attach a photo · Save · Delete (if editing).
- **States:** `idle` · `saving` · `saved` (dismiss + toast, and if the delta crosses a milestone, a celebration) · `duplicate_date` (offer to overwrite) · `implausible` (>3 kg change in a day → *"That's a big jump — double-check?"* with a confirm, never a hard block).
- **CTAs:** **Save weight**.
- **Empty state:** N/A.
- **Loading state:** None — fully local until save.

---

### 8.15 Profile (tab 4)

- **Purpose:** Account, subscription, and control — quiet, sparse, trustworthy. Not a dashboard.
- **UI sections:**
  1. **Identity** — avatar, name, email.
  2. **Subscription card** — plan name, status, renewal date; or **Start free trial** for free users. `Manage subscription` deep-links to the OS subscription settings.
  3. **Your plan** — calorie goal, protein goal, target weight, pace → `/settings/goals`.
  4. **Reminders** — reminder times → `/settings/reminders`.
  5. **Notifications** — per-category toggles → `/settings/notifications`.
  6. **Preferences** — units, (dark mode when it ships).
  7. **Stats strip** — days tracked, meals logged, current streak, level.
  8. **Support** — help, rate the app, contact.
  9. **Account** — change password, sign out, delete account.
  10. **Footer** — version, Terms, Privacy.
- **Components:** `Screen`, `Avatar`, `Card`, `SettingsRow`, `Badge`, `Button`, `Skeleton`.
- **User actions:** Tap any row · manage subscription · restore purchases · sign out (confirm) · delete account (double confirm) · rate · contact support.
- **States:** `loading` · `loaded` · `free` (subscription card is a trial CTA) · `trialing` (*"Trial — 2 days left"* + renewal date + honest price line) · `active` · `in_grace_period` (*"There's a problem with your payment"* + **Update payment**) · `expired` (**Resubscribe**) · `signing_out` · `deleting`.
- **CTAs:** **Start free trial** / **Manage subscription** · Sign out · Delete account (danger).
- **Empty state:** N/A.
- **Loading state:** Identity + subscription card shimmer; static rows render immediately.

---

### 8.16 Settings — Goals

- **Purpose:** Let users change the inputs behind their plan and see the consequence before committing.
- **UI sections:** Current weight · target weight · height · activity level · gym experience · pace (lean/aggressive) · optional age · **live recalculated preview** (new calorie + protein goal, new target date, with deltas vs. current) · Save.
- **Components:** `Screen`, `SettingsRow`, `RulerPicker` sheets, `OptionCard`, `StatTile`, `Button`.
- **User actions:** Edit any field · watch the preview update live · Save · Reset to calculated (if they've manually overridden).
- **States:** `idle` · `dirty` (Save enabled, preview shows `+180 cal` style deltas) · `saving` · `saved` (toast + reschedule local notifications, since the copy embeds the goal) · `manual_override` (a user typing their own calorie goal — allowed, with an *"Using your custom goal"* badge and a one-tap revert).
- **CTAs:** **Save changes**.
- **Empty state:** N/A.
- **Loading state:** Row shimmers.

---

### 8.17 Settings — Reminders & Notifications

- **Purpose:** Full control over timing and categories, so users mute a category instead of revoking OS permission entirely (a revoked permission is nearly unrecoverable).
- **UI sections:** OS permission status banner (with **Open Settings** when denied) · reminder times list (morning / midday / evening, each editable, each removable, "Add reminder") · shake reminder time · quiet hours (start/end) · category toggles: daily calorie reminders, streak alerts, milestones, weekly summary, motivational messages, trial & billing (billing cannot be disabled) · a **Send test notification** button.
- **Components:** `Screen`, `SettingsRow`, `Switch`, `TimePicker`, `Button`, `Banner`.
- **User actions:** Toggle categories · add/edit/remove reminder times · set quiet hours · send a test · open OS settings.
- **States:** `permission_granted` · `permission_denied` (all controls dimmed behind the banner) · `saving` (debounced 500ms) · `rescheduling` · `error`.
- **CTAs:** **Send test notification** · Open Settings (when denied).
- **Empty state:** No reminders configured → *"No reminders set — most people who hit their goals use at least two."* + **Add reminder**.
- **Loading state:** Switch rows render immediately from cached prefs; permission status resolves async.

---

### 8.18 Settings — Account

- **Purpose:** Credentials, data export, and deletion — handled properly, because App Review checks this.
- **UI sections:** Email (with verified badge) · change password (email/password users only) · connected sign-in methods · export my data · **Delete account** (danger zone, visually separated).
- **Components:** `Screen`, `SettingsRow`, `Button`, `ConfirmDialog`.
- **User actions:** Change password · export data (emailed JSON) · delete account.
- **States:** `idle` · `submitting` · `error` · `confirm_delete` (two-step: type `DELETE`, then confirm) · `deleting` (blocking overlay).
- **CTAs:** **Update password** · **Delete my account** (danger).
- **Empty state:** N/A.
- **Loading state:** Row-level spinners.

> **Deletion must be complete and must be reachable in-app** — Apple requires it for any app with account creation. Flow: confirm → Convex mutation purges all user rows and stored images → Clerk `user.delete()` → sign out → Welcome. RevenueCat data is retained per their policy but detached from the alias.

---

### 8.19 Paywall

- **Purpose:** Convert the plan reveal into a trial start, with annual as the default. Highest-value screen in the app; expect to iterate it 5+ times.
- **UI sections:**
  1. **Close `✕`** — top-left, immediately tappable, no timer. Non-negotiable.
  2. **Hero** — headline tied to *their* number: *"Hit 3,140 calories every day."*
  3. **Value stack** — 4–5 rows with icons: Unlimited AI meal scans · Personalized calorie & protein targets · Weight & streak tracking · Progress charts & photos · Smart reminders.
  4. **Trial timeline graphic** — the trust device: `Today: full access → Day 2: reminder email/notification → Day 3: trial ends, $24.99/yr`. Explicit and honest; measurably raises conversion *and* cuts refunds.
  5. **Plan selector** — two cards. **Annual pre-selected** with a `SAVE 77%` badge and `$2.08/mo` framing; Monthly secondary at `$8.99/mo`.
  6. **Primary CTA** — **Start my 3-day free trial**.
  7. **Reassurance line** — *"No charge today. Cancel anytime in Settings."*
  8. **Footer** — Restore purchases · Terms · Privacy · the required auto-renew disclosure sentence.
  9. Optional social proof once real reviews exist (never fabricated).
- **Components:** `Screen`, `PlanCard`, `ValueRow`, `TrialTimeline`, `Button`, `Link`, `Skeleton`.
- **User actions:** Select plan · start trial · restore purchases · close · open Terms/Privacy.
- **States:**
  - `loading_offerings` — skeleton plan cards (never render a hardcoded price; always render RevenueCat's localized `product.priceString`).
  - `loaded` · `plan_selected` · `purchasing` (button spinner, everything else locked).
  - `purchase_success` → entitlement refresh → `/(tabs)`.
  - `purchase_cancelled` — silent return to `loaded`. **Not an error.**
  - `purchase_failed` — human-readable message + retry.
  - `already_subscribed` — *"You're already subscribed"* → restore → tabs.
  - `restoring` / `restore_no_purchases`.
  - `offerings_unavailable` (network/StoreKit down) — *"Can't reach the App Store right now."* + retry + a **Continue with limited access** escape so the user is never trapped.
  - `ineligible_for_trial` (previously trialed) — hide trial language, show direct pricing. Never promise a trial the store will refuse.
- **CTAs:** **Start my 3-day free trial** (or **Subscribe** when trial-ineligible) · Restore purchases · `✕`.
- **Empty state:** N/A.
- **Loading state:** Full layout with two shimmering plan cards; hero and value stack render instantly (they're static) so the screen feels loaded even while StoreKit resolves.

> **Compliance:** price, billing period, trial length, and auto-renewal must all be visible on this screen without scrolling past the CTA, with functioning Terms and Privacy links. This is the single most common rejection reason for subscription apps.

---

### 8.20 Paywall gate (inline)

- **Purpose:** Convert at the point of desire, inside the feature, rather than bouncing users out.
- **UI sections:** Blurred/masked preview of the real content behind it · lock icon · one-line feature-specific value prop (*"See your full weight trend"*) · **Unlock** button.
- **Components:** `PaywallGate`, `BlurView`, `Button`.
- **User actions:** Tap Unlock → `/paywall` (with a `source` param for funnel attribution).
- **States:** `locked` · `unlocked` (renders children) · `checking` (renders children optimistically to avoid a lock flash on cold start — a paying user must never see a lock).
- **CTAs:** **Unlock with free trial**.
- **Empty state:** N/A.
- **Loading state:** Renders children optimistically, then reconciles.

---

## 9. Feature Specifications

### 9.1 Daily calorie & protein tracking

**What it does:** Aggregates every logged meal into a per-day total against the user's goal, and exposes "remaining" as the primary number.

- Day boundary is **local midnight** in the user's stored IANA timezone — never UTC. A `dateKey` of `YYYY-MM-DD` is computed client-side from the device timezone and passed into every mutation, so a user logging at 11:50pm and 12:10am gets two different days correctly.
- Timezone changes (travel) are handled by re-reading the device timezone on app foreground and updating the user record. Historical `dateKey`s are never rewritten.
- Meals are editable and deletable; every mutation recomputes the `dailyLogs` row transactionally in the same Convex mutation. No screen ever aggregates at read time.
- Over-goal is celebrated, not warned. This is the core inversion of the category.
- **Offline:** Convex queues mutations and replays on reconnect; reads serve the last-known value. A full offline write queue with conflict UI is post-MVP (§19).

**Acceptance criteria:** logging a meal updates the Home ring within 300ms (optimistic) · deleting restores the exact prior total · a meal logged at 11:59pm local counts for that day · the day rolls over without a manual refresh.

### 9.2 AI food image analysis

See §10 for the full flow. **Acceptance criteria:** p50 end-to-end under 5s · a recognizable single-plate meal returns non-zero calories ≥90% of the time · every failure mode offers manual entry · the OpenAI key never appears in the client bundle · free users are hard-capped at 3 lifetime scans, enforced server-side.

### 9.3 Curated high-calorie foods library

**What it does:** A hand-picked set of ~60–80 foods across **breakfast, lunch, dinner, snacks, shakes**, each with an image, estimated calories, protein, and a one-line description of why it works for bulking.

- Stored in a Convex **`foods`** table, seeded from `data/foods.seed.json` by `npx convex run foods:seed`. Content can be added or corrected without an app release.
- Images: uploaded to Convex file storage (or a CDN) at 2 sizes (thumb 400px, hero 1200px), served through `expo-image` with disk caching.
- Curation bias: **calorie-dense, cheap, low-effort, and actually appetizing**. Peanut butter, whole milk, rice, oats, eggs, bananas, olive oil, granola, full-fat yoghurt, mass-gainer shakes. Every item should be makeable by a student with a kettle and a blender.
- Each entry carries a `caloriesPerServing`, `servingLabel` ("1 shake (400ml)"), and macros, so quick-add is unambiguous.

**Acceptance criteria:** all 5 categories populated with ≥10 items each at launch · quick-add logs in one tap · images load from cache offline · re-running the seed script is idempotent.

### 9.4 Weight tracking

Manual entry via ruler picker, one canonical entry per date (later entry overwrites with confirmation), stored in kg. A **7-day moving average** is what the chart emphasizes — daily raw values are plotted faintly. This is a deliberate psychological choice: raw daily weight is noisy enough to convince a gaining user they're failing.

**Acceptance criteria:** entries appear on the chart immediately · unit toggle never mutates stored data · crossing a whole-kg gain milestone fires a celebration + notification · a >3 kg single-day delta prompts a confirm but is never blocked.

### 9.5 Progress charts

Weight line chart (with goal line + moving average), 7-day calorie consistency bars, month streak heatmap, weekly summary. Built with `react-native-gifted-charts` (SVG-based — deliberately avoids pulling `@shopify/react-native-skia` into the bundle for the small number of charts we need).

**Acceptance criteria:** charts render under 2 weeks of data without breaking · no crash at 0 or 1 data points · scrubbing shows a date + value tooltip · fixed skeleton height prevents layout shift.

### 9.6 Push & local notifications

See §16.

### 9.7 Streak & XP system

See §17.

### 9.8 Subscription & paywall

See §15. **Acceptance criteria:** entitlement resolves correctly on cold start with no lock-flash for paying users · gating is enforced server-side for AI scans · restore works on a fresh install · trial-ineligible users never see trial copy.

### 9.9 Profile & settings

See §8.15–8.18. **Acceptance criteria:** goal changes recalculate and reschedule notifications · account deletion is reachable in-app and purges all data · unit preference is respected app-wide.

---

## 10. AI Food Analysis Flow

### Priorities, in order

1. **Speed** — under 5s or the user stops trusting it.
2. **Simplicity** — photo in, one number out, editable.
3. **Convenience** — always produces *something* actionable.
4. **Accuracy** — last. ±15% is fine, and we say so in the UI.

> A user who logs 2,900 ± 300 kcal every day for 90 days gains weight. A user who logs perfectly for 4 days and quits does not. The product optimizes for the first user.

### End-to-end flow

```
[Client]
  1. CameraView.takePictureAsync({ quality: 0.7 })
  2. expo-image-manipulator → resize longest edge to 1024px, JPEG q=0.7
     (≈150–250KB — the single biggest lever on both latency and token cost)
  3. convex.mutation(ai.generateUploadUrl) → POST the blob → { storageId }
  4. convex.action(ai.analyzeMeal, { storageId, dateKey })
        │
        ▼
[Convex — "use node" action]
  5. Authorize: identity from Clerk JWT → check premium OR scansUsed < 3
  6. ctx.storage.getUrl(storageId) → short-lived signed URL
  7. Call OpenAI vision (chat completions / responses API) with:
        - the image URL
        - the system prompt below
        - a strict JSON schema for structured output
  8. Validate + sanitize the response (clamp implausible values)
  9. Insert into `aiScans` (tokens, latency, cost, model, confidence)
 10. Increment user.scansUsed
 11. Return the parsed estimate to the client
        │
        ▼
[Client]
 12. Push /scan/review with the estimate
 13. User adjusts → convex.mutation(meals.create) → dailyLogs recomputed → XP awarded
```

**The OpenAI API key lives only in Convex environment variables and is used only inside a Node action.** It must never be an `EXPO_PUBLIC_*` variable, never be in `app.json`, and never be reachable from the client bundle. This is not negotiable — a leaked key in a shipped binary is unrecoverable without a forced update.

### Model choice

Use a **current OpenAI vision-capable model with structured-output support**. Start on the cheapest tier that clears the accuracy bar and only escalate if review-sheet edit rates are high (that's your accuracy telemetry — if users correct >40% of scans, upgrade the model or the prompt).

> ⚠️ **Verify the exact model id against OpenAI's current model list at implementation time.** Model names in this category change every few months; hardcoding a stale one is a launch-day 404. Put it in a Convex env var (`OPENAI_VISION_MODEL`) so it can be changed without a deploy of the app.

### Prompt strategy

```
You are a nutrition estimator for a weight-GAIN app. The user is trying to eat
MORE calories, not fewer.

Given a photo of a meal:
- Identify each distinct food item you can see.
- Estimate the portion using visual references (plate size, utensils, hands).
- When portion size is ambiguous, estimate toward the LARGER plausible portion.
  Under-estimating actively harms this user.
- Assume normal home cooking: real oil, real butter, whole-fat dairy.
- Always return a usable estimate. Never refuse, never return zero for a
  recognizable food.
- If the image contains no food at all, set no_food_detected = true.

Return ONLY the structured JSON object.
```

**Structured output schema:**

```jsonc
{
  "label": "Chicken rice bowl",            // short display name
  "items": [
    { "name": "Grilled chicken thigh", "portion": "~150g",
      "calories": 320, "protein": 28, "carbs": 0, "fat": 22 }
  ],
  "totals": { "calories": 1240, "protein": 58, "carbs": 112, "fat": 61 },
  "confidence": "high",                    // high | medium | low
  "no_food_detected": false,
  "notes": "Oil used in cooking is included in the estimate."
}
```

### Guardrails & failure handling

| Risk | Mitigation |
|---|---|
| Slow response | 15s timeout, then offer retry + manual entry. Never an infinite spinner. |
| Non-food photo | `no_food_detected` → *"Couldn't find food in that photo"* + retake + manual. |
| Absurd values | Server clamps to 10–5,000 kcal per meal; protein ≤ 300g. Flag clamped scans in `aiScans`. |
| Malformed JSON | Structured outputs make this rare; on parse failure, retry once, then fall back to manual. |
| Cost blowout | 1024px images · cheapest viable model · per-user daily cap (e.g. 20 premium / 3 lifetime free) · all spend logged to `aiScans` with a dashboard query. |
| Abuse | Server-side auth + rate limit per user per hour. Client-side limits are decoration. |
| Duplicate submission | Idempotency on `storageId` — re-calling with the same id returns the cached result instead of re-billing. |
| Photo privacy | Meal photos are private per-user, only reachable via short-lived signed URLs, and purged on account deletion. Say so in the privacy policy. |

### Cost model (sanity check before launch)

Estimate: `scans/user/day × users × cost/scan`. At ~8 scans per WAU and a low-tier vision model, keep the blended AI cost per subscriber well under **10% of ARPU** ($24.99/yr ≈ $2.08/mo → keep AI cost under ~$0.20/user/month). If it drifts above that, the levers in order: smaller images → cheaper model → tighter daily cap → cache repeat meals.

---

## 11. Technical Stack

### Already installed (do not change — SDK 54 pins these)

| Package | Version |
|---|---|
| `expo` | `~54.0.35` |
| `react-native` | `0.81.5` |
| `react` / `react-dom` | `19.1.0` |
| `expo-router` | `~6.0.24` |
| `react-native-reanimated` | `~4.1.1` |
| `react-native-worklets` | `0.5.1` |
| `react-native-gesture-handler` | `~2.28.0` |
| `react-native-safe-area-context` | `~5.6.0` |
| `react-native-screens` | `~4.16.0` |
| `expo-image`, `expo-font`, `expo-haptics`, `expo-linking`, `expo-splash-screen`, `expo-constants`, `expo-status-bar`, `expo-system-ui`, `expo-symbols`, `expo-web-browser` | SDK 54 versions |
| `typescript` | `~5.9.2` (strict) |

Already enabled in `app.json`: `newArchEnabled`, `typedRoutes`, `reactCompiler`.

### To add

| Purpose | Packages | Notes |
|---|---|---|
| **Styling** | `nativewind@4.2.1`, `tailwindcss@3.4.17` | ⚠️ **Pin these exact versions.** See §24. |
| **Backend** | `convex` | Reactive DB + functions + file storage + crons |
| **Auth** | `@clerk/expo`, `expo-secure-store` | `tokenCache` from `@clerk/expo/token-cache` |
| **Payments** | `react-native-purchases`, `react-native-purchases-ui` | Requires a dev build |
| **Dev build** | `expo-dev-client` | Mandatory from day one |
| **Camera** | `expo-camera` | `CameraView`, `useCameraPermissions()` |
| **Photos** | `expo-image-picker`, `expo-image-manipulator` | Library pick + downscale |
| **Notifications** | `expo-notifications`, `expo-device` | Local + Expo Push |
| **Charts** | `react-native-svg`, `react-native-gifted-charts` | SVG-based; avoids Skia |
| **State** | `zustand` | Onboarding draft + ephemeral UI state only |
| **Dates** | `date-fns`, `expo-localization` | Timezone-correct `dateKey` handling |
| **Errors** | `@sentry/react-native` | Crash + error reporting |
| **Blur** | `expo-blur` | `PaywallGate` masking |
| **Gradient** | `expo-linear-gradient` | Paywall / plan reveal accents |

> **Install rule: always `npx expo install <pkg>`, never `npm install`.** `expo install` resolves the SDK-54-correct version; bare `npm install` will happily give you a version that crashes at runtime. The only exceptions are the two pinned styling packages, which must be installed at their exact versions.

### State management philosophy

**Convex reactive queries are the source of truth for all server data.** No Redux, no React Query, no client cache layer — `useQuery` already gives live-updating, subscription-based reads, which is the entire reason Convex was chosen. Zustand holds exactly two things: the onboarding draft, and transient UI state (active category chip, chart range). If you find yourself caching server data in Zustand, you've made a mistake.

### Environment variables

| Variable | Location | Public? |
|---|---|---|
| `EXPO_PUBLIC_CONVEX_URL` | `.env.local`, EAS secrets | ✅ Public |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | `.env.local`, EAS secrets | ✅ Public |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | `.env.local`, EAS secrets | ✅ Public (RC public SDK key) |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | `.env.local`, EAS secrets | ✅ Public |
| `OPENAI_API_KEY` | **Convex env only** | 🔒 **Never client** |
| `OPENAI_VISION_MODEL` | Convex env | 🔒 Server |
| `CLERK_WEBHOOK_SECRET` | Convex env | 🔒 Server |
| `REVENUECAT_WEBHOOK_AUTH` | Convex env | 🔒 Server |
| `EXPO_ACCESS_TOKEN` | Convex env (for push sends) | 🔒 Server |

`.env.local` is git-ignored. Nothing secret goes in `app.json`.

---

## 12. Folder Structure

```
CalBoost/
├── app/                              # expo-router file-based routes
│   ├── _layout.tsx                   # Providers: Clerk → Convex → Theme → Stack
│   ├── index.tsx                     # Auth/onboarding redirect gate
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── verify.tsx
│   ├── (onboarding)/
│   │   ├── _layout.tsx               # Progress bar chrome + draft store provider
│   │   ├── gender.tsx      height.tsx      weight.tsx
│   │   ├── target.tsx      activity.tsx    experience.tsx
│   │   ├── pace.tsx        reminders.tsx   plan.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx               # 4-tab bottom navigator
│   │   ├── index.tsx                 # HOME
│   │   ├── foods.tsx                 # FOODS
│   │   ├── progress.tsx              # PROGRESS
│   │   └── profile.tsx               # PROFILE
│   ├── food/[id].tsx
│   ├── scan/
│   │   ├── index.tsx                 # Camera
│   │   └── review.tsx                # Analyzing + review sheet
│   ├── meal/
│   │   ├── add.tsx
│   │   └── [id].tsx
│   ├── weight/log.tsx
│   ├── paywall.tsx
│   └── settings/
│       ├── goals.tsx   reminders.tsx   notifications.tsx
│       ├── units.tsx   account.tsx
│
├── components/
│   ├── ui/                           # Button, Card, Screen, ProgressRing, Sheet,
│   │                                 # StatTile, Chip, EmptyState, Skeleton, Toast…
│   ├── home/                         # CalorieRingCard, ProteinBar, DailyTasks,
│   │                                 # MealList, WeightCard, XPBar, StreakPill
│   ├── foods/                        # FoodCard, CategoryChips, FoodSearch
│   ├── progress/                     # WeightChart, StreakCalendar, ConsistencyBars,
│   │                                 # WeeklySummary, PhotoGrid
│   ├── onboarding/                   # OptionCard, RulerPicker, StepHeader
│   ├── paywall/                      # PlanCard, ValueRow, TrialTimeline, PaywallGate
│   └── charts/                       # Thin wrappers over gifted-charts + theme
│
├── convex/
│   ├── schema.ts                     # All tables + indexes
│   ├── auth.config.ts                # Clerk JWT issuer
│   ├── users.ts                      # upsert, get, updateProfile, updateGoals, delete
│   ├── onboarding.ts                 # completeOnboarding (single mutation)
│   ├── meals.ts                      # create, update, remove, listForDay
│   ├── dailyLogs.ts                  # getToday, getRange, recompute (internal)
│   ├── foods.ts                      # list, get, seed
│   ├── weights.ts                    # log, list, latest
│   ├── gamification.ts               # awardXp, updateStreak, tasks, milestones
│   ├── ai.ts                         # "use node" — generateUploadUrl, analyzeMeal
│   ├── notifications.ts              # registerToken, send, scheduleTrialReminder
│   ├── subscriptions.ts              # get, syncFromWebhook
│   ├── crons.ts                      # streak-at-risk, weekly summary, win-back
│   ├── http.ts                       # Clerk + RevenueCat webhook endpoints
│   └── _generated/
│
├── lib/
│   ├── nutrition.ts                  # BMR, TDEE, calorie/protein goals, timeline
│   ├── units.ts                      # kg↔lb, cm↔ft-in — display boundary only
│   ├── dates.ts                      # dateKey, local day boundaries, streak math
│   ├── xp.ts                         # XP values, level curve
│   ├── revenuecat.ts                 # configure, offerings, purchase, entitlement
│   ├── notifications.ts              # permission, tokens, local scheduling
│   ├── image.ts                      # resize/compress before upload
│   └── analytics.ts                  # typed event emitter
│
├── hooks/
│   ├── useUser.ts        useToday.ts        useSubscription.ts
│   ├── useGoals.ts       useStreak.ts       useScanLimit.ts
│
├── store/
│   └── onboarding.ts                 # Zustand draft
│
├── constants/
│   ├── theme.ts                      # ⭐ Design tokens — single source of truth
│   ├── copy.ts                       # All user-facing strings incl. notifications
│   └── config.ts                     # Feature flags, limits
│
├── data/
│   └── foods.seed.json               # Curated foods content
│
├── design/                           # 🎨 Visual reference images (source of truth)
│
├── assets/
│   ├── images/    fonts/
│
├── app.json   tailwind.config.js   metro.config.js   babel.config.js
├── global.css   nativewind-env.d.ts   tsconfig.json   eslint.config.js
└── plan.md
```

---

## 13. Database & Convex Schema

### Design principles

1. **`clerkId` is the join key.** Every user row carries the Clerk subject; every query is scoped by it via the authenticated identity, never by a client-supplied user id.
2. **Denormalize the hot read.** `dailyLogs` stores pre-aggregated per-day totals. Home reads exactly one row. Never `.collect()` a user's meals to compute today's total — that's a query that gets slower every day the user stays.
3. **Compound indexes on `(userId, dateKey)`** everywhere time-series data is read.
4. **Compute on write.** Streaks, XP, and daily totals are updated inside the same mutation that creates the meal, atomically.
5. **Snapshot the goal.** `dailyLogs` stores the calorie/protein goal *as it was that day*, so changing your goal today doesn't rewrite last month's history.

### `convex/schema.ts`

```ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId:   v.string(),
    email:     v.string(),
    name:      v.optional(v.string()),
    imageUrl:  v.optional(v.string()),

    // Profile (from onboarding) — always metric
    gender:     v.optional(v.union(v.literal('male'), v.literal('female'), v.literal('unspecified'))),
    age:        v.optional(v.number()),
    heightCm:   v.optional(v.number()),
    startWeightKg:   v.optional(v.number()),
    currentWeightKg: v.optional(v.number()),
    targetWeightKg:  v.optional(v.number()),
    activityLevel: v.optional(v.union(
      v.literal('sedentary'), v.literal('light'), v.literal('active'), v.literal('very_active'))),
    gymExperience: v.optional(v.union(
      v.literal('none'), v.literal('under_1y'), v.literal('over_1y'))),
    goalType: v.optional(v.union(v.literal('lean_bulk'), v.literal('aggressive_bulk'))),

    // Computed goals
    calorieGoal:  v.optional(v.number()),
    proteinGoal:  v.optional(v.number()),
    targetDate:   v.optional(v.string()),      // YYYY-MM-DD
    goalIsManual: v.optional(v.boolean()),
    goalBasisWeightKg: v.optional(v.number()), // for the 2kg auto-recalc trigger

    // Preferences
    units:    v.optional(v.union(v.literal('metric'), v.literal('imperial'))),
    timezone: v.optional(v.string()),          // IANA, e.g. "Asia/Kolkata"

    // Gamification
    xp:            v.optional(v.number()),
    level:         v.optional(v.number()),
    currentStreak: v.optional(v.number()),
    longestStreak: v.optional(v.number()),
    lastStreakDate:      v.optional(v.string()),
    forgivenessUsedWeek: v.optional(v.string()), // ISO week key

    // Entitlement mirror (server truth — see §15)
    isPremium:       v.optional(v.boolean()),
    subscriptionTier: v.optional(v.union(v.literal('none'), v.literal('trial'),
                                        v.literal('monthly'), v.literal('annual'))),
    scansUsed:      v.optional(v.number()),     // lifetime, for the free cap

    onboardedAt: v.optional(v.number()),
    createdAt:   v.number(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email']),

  // ⭐ The hot table. Home reads exactly one of these.
  dailyLogs: defineTable({
    userId:  v.id('users'),
    dateKey: v.string(),                 // YYYY-MM-DD, user-local
    calories: v.number(),
    protein:  v.number(),
    carbs:    v.number(),
    fat:      v.number(),
    calorieGoal: v.number(),             // snapshot of that day's goal
    proteinGoal: v.number(),
    mealCount:   v.number(),
    goalHit:     v.boolean(),            // calories >= 0.95 * calorieGoal
    proteinHit:  v.boolean(),
    tasksCompleted: v.array(v.string()),
    xpEarned: v.number(),
    updatedAt: v.number(),
  }).index('by_user_and_date', ['userId', 'dateKey']),

  meals: defineTable({
    userId:  v.id('users'),
    dateKey: v.string(),
    name:    v.string(),
    mealType: v.union(v.literal('breakfast'), v.literal('lunch'),
                      v.literal('dinner'), v.literal('snack')),
    calories: v.number(),
    protein:  v.number(),
    carbs:    v.number(),
    fat:      v.number(),
    source:   v.union(v.literal('ai'), v.literal('curated'), v.literal('manual')),
    items: v.optional(v.array(v.object({
      name: v.string(), portion: v.optional(v.string()),
      calories: v.number(), protein: v.number(),
      carbs: v.optional(v.number()), fat: v.optional(v.number()),
    }))),
    imageId:    v.optional(v.id('_storage')),
    foodId:     v.optional(v.id('foods')),
    scanId:     v.optional(v.id('aiScans')),
    multiplier: v.optional(v.number()),
    loggedAt:   v.number(),
  })
    .index('by_user_and_date', ['userId', 'dateKey'])
    .index('by_user_and_logged_at', ['userId', 'loggedAt']),   // "recent meals"

  foods: defineTable({
    name:     v.string(),
    category: v.union(v.literal('breakfast'), v.literal('lunch'), v.literal('dinner'),
                      v.literal('snacks'), v.literal('shakes')),
    description:  v.string(),            // 1–2 sentences, bulking angle
    servingLabel: v.string(),            // "1 shake (400ml)"
    calories: v.number(),
    protein:  v.number(),
    carbs:    v.number(),
    fat:      v.number(),
    imageUrl:      v.string(),
    thumbnailUrl:  v.optional(v.string()),
    tags:      v.optional(v.array(v.string())),  // 'vegetarian','no-cook','cheap','high-protein'
    sortOrder: v.number(),
    isActive:  v.boolean(),
  })
    .index('by_category', ['category', 'sortOrder'])
    .index('by_active', ['isActive'])
    .searchIndex('search_name', { searchField: 'name', filterFields: ['category'] }),

  weightLogs: defineTable({
    userId:   v.id('users'),
    dateKey:  v.string(),
    weightKg: v.number(),
    note:     v.optional(v.string()),
    photoId:  v.optional(v.id('_storage')),
    loggedAt: v.number(),
  }).index('by_user_and_date', ['userId', 'dateKey']),

  progressPhotos: defineTable({
    userId:   v.id('users'),
    dateKey:  v.string(),
    storageId: v.id('_storage'),
    weightKg: v.optional(v.number()),
    createdAt: v.number(),
  }).index('by_user_and_date', ['userId', 'dateKey']),

  xpEvents: defineTable({
    userId: v.id('users'),
    dateKey: v.string(),
    type:   v.string(),        // 'meal_logged' | 'calorie_goal' | 'protein_goal' | …
    amount: v.number(),
    createdAt: v.number(),
  }).index('by_user_and_date', ['userId', 'dateKey']),

  milestones: defineTable({
    userId: v.id('users'),
    type:   v.string(),        // 'streak_7' | 'first_kg' | 'level_5' | …
    value:  v.optional(v.number()),
    achievedAt: v.number(),
  }).index('by_user', ['userId']),

  pushTokens: defineTable({
    userId:   v.id('users'),
    token:    v.string(),      // ExponentPushToken[...]
    platform: v.union(v.literal('ios'), v.literal('android')),
    deviceId: v.optional(v.string()),
    isActive: v.boolean(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_token', ['token']),

  notificationPrefs: defineTable({
    userId: v.id('users'),
    calorieReminders: v.boolean(),
    streakAlerts:     v.boolean(),
    milestones:       v.boolean(),
    weeklySummary:    v.boolean(),
    motivational:     v.boolean(),
    shakeReminder:    v.boolean(),
    reminderTimes: v.array(v.string()),   // ["09:00","13:00","20:00"]
    shakeTime:     v.optional(v.string()),
    quietHoursStart: v.optional(v.string()),
    quietHoursEnd:   v.optional(v.string()),
  }).index('by_user', ['userId']),

  // RevenueCat mirror — the server-side source of truth for gating
  subscriptions: defineTable({
    userId: v.id('users'),
    revenueCatAppUserId: v.string(),
    productId:      v.optional(v.string()),
    entitlement:    v.optional(v.string()),          // 'premium'
    status: v.union(v.literal('none'), v.literal('trialing'), v.literal('active'),
                    v.literal('grace_period'), v.literal('expired'), v.literal('cancelled')),
    isTrial:        v.boolean(),
    willRenew:      v.boolean(),
    periodType:     v.optional(v.string()),
    trialEndsAt:    v.optional(v.number()),
    expiresAt:      v.optional(v.number()),
    lastEventType:  v.optional(v.string()),
    lastEventAt:    v.optional(v.number()),
    store:          v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_rc_user', ['revenueCatAppUserId']),

  aiScans: defineTable({
    userId:   v.id('users'),
    storageId: v.id('_storage'),
    model:    v.string(),
    status:   v.union(v.literal('success'), v.literal('no_food'),
                      v.literal('error'), v.literal('timeout')),
    result:   v.optional(v.any()),
    confidence: v.optional(v.string()),
    wasClamped: v.optional(v.boolean()),
    latencyMs:  v.optional(v.number()),
    inputTokens:  v.optional(v.number()),
    outputTokens: v.optional(v.number()),
    estimatedCostUsd: v.optional(v.number()),
    userEditedResult: v.optional(v.boolean()),   // ⭐ accuracy telemetry
    error:     v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_storage', ['storageId'])          // idempotency
    .index('by_created', ['createdAt']),
});
```

### Key function contracts

| Function | Type | Contract |
|---|---|---|
| `users.upsertFromClerk` | internal mutation | Called by the Clerk webhook. Idempotent on `clerkId`. |
| `users.current` | query | Returns the caller's user row + goals + entitlement. The app's root query. |
| `onboarding.complete` | mutation | Takes all 7 answers, computes goals, writes `users` + `notificationPrefs` in one transaction, sets `onboardedAt`. |
| `meals.create` | mutation | Inserts the meal, recomputes `dailyLogs` for that `dateKey`, awards XP, updates the streak — atomically. |
| `meals.remove` | mutation | Deletes and recomputes. Streak recomputes if the day drops below goal. |
| `dailyLogs.getToday` | query | One indexed read. Home's primary subscription. |
| `dailyLogs.getRange` | query | `(userId, from, to)` for charts and the calendar heatmap. |
| `foods.list` | query | Filtered by category, ordered by `sortOrder`. Cacheable. |
| `foods.seed` | mutation | Idempotent upsert from `data/foods.seed.json`, keyed on name+category. |
| `weights.log` | mutation | Upserts on `(userId, dateKey)`, updates `users.currentWeightKg`, checks milestones, triggers goal recalc if the delta ≥ 2 kg. |
| `ai.generateUploadUrl` | mutation | Short-lived Convex upload URL. Auth required. |
| `ai.analyzeMeal` | **action** (`"use node"`) | Auth + limit check → OpenAI → validate → log → return. Idempotent per `storageId`. |
| `gamification.awardXp` | internal mutation | Append to `xpEvents`, bump `users.xp`/`level`, fire milestones. |
| `subscriptions.syncFromWebhook` | internal mutation | Writes the RevenueCat event; sets `users.isPremium`. |
| `notifications.sendToUser` | internal action | Expo Push send, respecting prefs + quiet hours. |

---

## 14. Clerk Auth Flow

### Packages & config

```bash
npx expo install @clerk/expo expo-secure-store
```

```jsonc
// app.json → plugins
"plugins": ["expo-router", "expo-secure-store", "@clerk/expo", /* … */]
```

> ⚠️ The current Clerk Expo package is **`@clerk/expo`** (the older name was `@clerk/clerk-expo`). Confirm the package name, the `AuthView` props, and the token-cache import path against Clerk's live Expo quickstart before writing Phase 1 code — Clerk's Expo SDK has moved fast.

### Provider composition — `app/_layout.tsx`

```tsx
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

### Convex side — `convex/auth.config.ts`

```ts
export default {
  providers: [{
    domain: process.env.CLERK_JWT_ISSUER_DOMAIN,  // e.g. https://xxx.clerk.accounts.dev
    applicationID: 'convex',
  }],
};
```

Create a **JWT template named `convex`** in the Clerk dashboard. Without it, every Convex query returns unauthenticated and you'll waste an afternoon.

### Sign-in methods

| Method | Implementation | Notes |
|---|---|---|
| **Apple** | Clerk native `<AuthView />` | **Mandatory** on iOS because we offer Google. Configure the Apple provider in the Clerk dashboard with your Service ID + key. |
| **Google** | Clerk native `<AuthView />` | Configure the Google provider; register the iOS bundle ID in Clerk. |
| **Email + password** | `useSignUp()` / `useSignIn()` + email code verification | Full custom UI (§8.2–8.3). Clerk enforces breached-password checks — map those errors to human copy. |

The native `<AuthView />` handles the Google and Apple flows without `expo-crypto`, `useSSO`, or `useOAuth`, and needs a **development build** (not Expo Go).

Register the iOS bundle identifier as a native application in the Clerk dashboard before testing social sign-in, or the flows fail with an opaque error.

### Clerk → Convex user sync

Webhook is the reliable path (a client-side upsert can be skipped by a user who kills the app mid-signup):

1. Clerk dashboard → Webhooks → endpoint `https://<deployment>.convex.site/clerk-webhook`
2. Subscribe to `user.created`, `user.updated`, `user.deleted`
3. `convex/http.ts` verifies the Svix signature with `CLERK_WEBHOOK_SECRET`, then calls `internal.users.upsertFromClerk` / `deleteFromClerk`
4. Client-side safety net: on first authenticated mount, if `users.current` returns `null`, call `users.ensure` — covers webhook delay on a fresh signup so the user never stares at a blank Home

### Route protection

Gate in `app/index.tsx` using `useAuth()` + `useQuery(api.users.current)`:

```
!isLoaded                        → null (native splash stays up)
!isSignedIn                      → <Redirect href="/welcome" />
user === undefined               → null (Convex still loading)
user && !user.onboardedAt        → <Redirect href="/onboarding/gender" />
otherwise                        → <Redirect href="/(tabs)" />
```

Every Convex function starts with `const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new ConvexError('Unauthenticated');`. Authorization lives on the server; the client's job is only to not *show* things.

### Sign out & delete

- **Sign out:** `signOut()` → clear the Zustand store → cancel scheduled local notifications → `/welcome`. Do not clear the Convex cache manually.
- **Delete:** double confirm → `users.deleteAccount` (purges all rows + stored images) → `user.delete()` in Clerk → sign out. Must be reachable in-app (Apple requirement).

---

## 15. RevenueCat Integration

### Dashboard setup (do this before writing code)

1. **App Store Connect:** create the two auto-renewable subscriptions in one **subscription group** (so users can up/downgrade cleanly):
   - `calboost_monthly_899` — $8.99/month, **3-day free trial** introductory offer
   - `calboost_annual_2499` — $24.99/year, **3-day free trial** introductory offer
2. Fill in localizations, review screenshot, and the **App Store shared secret** into RevenueCat.
3. **RevenueCat:** project → iOS app → paste the shared secret and bundle ID.
4. Create entitlement **`premium`**; attach both products.
5. Create offering **`default`** with packages `$rc_monthly` and `$rc_annual`.
6. Copy the **public SDK key** → `EXPO_PUBLIC_REVENUECAT_IOS_KEY`.

### Install

```bash
npx expo install react-native-purchases react-native-purchases-ui expo-dev-client
```

> ⚠️ Native modules. After installing you **must run a full rebuild** (`npx expo run:ios` or an EAS dev build) — hot reload will throw an initialization error. Expo Go cannot make real purchases at all. RevenueCat's **Preview API Mode** lets you build and iterate on the paywall UI *before* the first native build lands, which is worth using so paywall design isn't blocked.

### Configuration — `lib/revenuecat.ts`

```ts
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

export function configureRevenueCat() {
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  const apiKey = Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY!
    : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY!;
  Purchases.configure({ apiKey });
}

// Call immediately after Clerk auth resolves, so RC identity === Clerk identity.
export async function identifyUser(clerkUserId: string) {
  await Purchases.logIn(clerkUserId);
}
```

**Aliasing the RevenueCat app user id to the Clerk user id is critical** — it's what makes the webhook able to find the right Convex user, and what makes a subscription survive a reinstall or follow a user across devices.

### Purchase flow

```ts
const offerings = await Purchases.getOfferings();
const pkg = offerings.current?.annual ?? offerings.current?.availablePackages[0];

try {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  const isPremium = typeof customerInfo.entitlements.active['premium'] !== 'undefined';
} catch (e: any) {
  if (e.userCancelled) return;          // NOT an error — return silently
  // show a human message + retry
}
```

- **Always render `pkg.product.priceString`**, never a hardcoded `"$24.99"`. It's localized and it's correct.
- **Restore:** `Purchases.restorePurchases()` on the paywall and in Profile. Required by Apple.
- **Trial eligibility:** check it and suppress trial language for ineligible users. Promising a trial the store won't grant is a guaranteed bad review.

### `useSubscription()` hook

```ts
// Returns: { isPremium, status, isTrial, expiresAt, daysLeftInTrial, refresh }
// Sources: Purchases.getCustomerInfo() + addCustomerInfoUpdateListener
//          for instant UI, reconciled against Convex `subscriptions` for truth.
```

### Webhook → Convex (the actual source of truth)

RevenueCat → Integrations → Webhooks → `https://<deployment>.convex.site/revenuecat-webhook` with an `Authorization` header matching `REVENUECAT_WEBHOOK_AUTH`.

Handle: `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `UNCANCELLATION`, `BILLING_ISSUE`, `SUBSCRIBER_ALIAS`, `EXPIRATION`, `PRODUCT_CHANGE`, `TRANSFER`.

Each event → `internal.subscriptions.syncFromWebhook` → update `subscriptions` + set `users.isPremium`.

**Why this matters:** AI scans cost real money per call. Gating them on a client-reported boolean is an open invoice. The Convex action re-checks `users.isPremium` server-side on every scan.

### Trial reminder

On `INITIAL_PURCHASE` with `period_type = TRIAL`, compute `trialEndsAt - 24h` and:
- schedule a **local** notification client-side (survives no-network), **and**
- register a server-side Convex scheduled function as a backstop (survives app deletion of local schedules).

De-duplicate with a `trialReminderSentAt` field so the user never gets it twice.

### Sandbox testing checklist

- [ ] Sandbox tester account in App Store Connect
- [ ] Trial → purchase → entitlement active
- [ ] Cancel in sandbox → expires → app drops to limited mode
- [ ] Restore on a fresh install
- [ ] Monthly → annual upgrade (same subscription group)
- [ ] Billing-issue / grace-period UI
- [ ] Webhook lands in Convex and flips `users.isPremium`
- [ ] Trial reminder fires ~24h before (sandbox trials are time-compressed — a 3-day trial is minutes)
- [ ] Trial-ineligible second purchase shows correct copy

---

## 16. Notification Strategy

Push permission is the highest-leverage retention asset in the app and it is granted exactly once. Earn it (§8.5), then never abuse it.

### Hard rules

1. **Max 3 notifications per day**, ever.
2. **Quiet hours respected** (default 22:00–08:00), except billing.
3. **Every category is individually mutable** in Settings — always give the user a smaller hammer than "revoke permission in iOS Settings."
4. **Never shame.** *"600 to go — a shake covers it"*, never *"You failed to hit your goal."*
5. **Every notification deep-links** to the screen that acts on it.
6. **Nothing sends if the action is already done** — no "you still need calories" to someone who hit their goal at 4pm.

### Local notifications (`expo-notifications`, scheduled on-device)

Used for predictable, time-based nudges. They work offline and cost nothing.

| Notification | Trigger | Copy |
|---|---|---|
| Morning start | `DAILY` @ user time (default 09:00) | *"3,140 calories today. Start with breakfast 🍳"* |
| Shake reminder | `DAILY` @ shake time (default 16:00) | *"Time to drink your shake 🥛"* |
| Evening gap | `DAILY` @ 20:00 | *"You still need 800 calories today"* — see dynamic note below |
| Weekly summary | `WEEKLY` Sun 19:00 | *"Your week: 5/7 days hit, +0.4 kg 📈"* |

**The "you still need X calories" problem:** local notifications are scheduled ahead of time and can't know today's remaining count. Solution: schedule the evening notification **locally at 20:00 with generic copy** as a guaranteed floor, and have the Convex cron send a **dynamic push** at 19:55 with the real number, cancelling the local one if the push succeeds. Best of both: always something, usually personalized.

Rescheduling: cancel-all and re-create whenever reminder times, goals, or category toggles change (`lib/notifications.ts` → `syncSchedule()`).

### Server push (Expo Push via Convex crons)

Needs `pushTokens` + `EXPO_ACCESS_TOKEN`. `getExpoPushTokenAsync({ projectId })` on first grant; store per device; deactivate tokens the Expo service reports as `DeviceNotRegistered`.

| Cron | Schedule | Audience | Copy |
|---|---|---|---|
| Dynamic calorie gap | 19:55 local (bucketed by timezone) | Under 80% of goal, logged today | *"You still need 800 calories today"* |
| Streak at risk | 21:00 local | Streak ≥3, nothing logged today | *"Don't break your 17-day streak 🔥"* |
| Streak completed | On goal hit | — | *"Day 17 completed 🔥"* |
| Milestone | On event | — | *"You've gained your first kilo. That's real progress."* |
| Weight nudge | Mon 09:00 | No weight log in 7 days | *"Quick weigh-in? Takes 5 seconds."* |
| Trial ending | `trialEndsAt − 24h` | Trialing | *"Your trial ends tomorrow — you've logged 14 meals so far."* |
| Win-back | Day 3 / 7 / 14 inactive | Lapsed | *"Your plan is still here. 3,140 calories, ready when you are."* |
| Motivational | 2×/week, opt-in | All | *"Consistency beats motivation."* |

### Copy bank — `constants/copy.ts`

Every string in one file, so tone can be reviewed in one place and A/B variants can be swapped without hunting through screens.

```ts
export const notifications = {
  calorieGap: [
    'You still need {n} calories today',
    '{n} calories to go — a shake covers it 🥛',
    'Almost there — {n} left',
  ],
  streakCompleted: ['Day {n} completed 🔥', '{n} days straight. Keep going.'],
  streakAtRisk: ["Don't break your {n}-day streak 🔥", 'Log something to keep Day {n} alive'],
  shake: ['Time to drink your shake 🥛', 'Shake o\'clock 🥤'],
  motivational: [
    'Consistency beats motivation.',
    'You\'re not skinny. You\'re just not in a surplus yet.',
    'Small surplus. Every day. That\'s the whole secret.',
    'The scale moves for people who show up.',
  ],
} as const;
```

Rotate within a category so the same phrasing never lands twice in a row — repetition is what trains users to swipe notifications away.

### Setup requirements

- `expo-notifications` config plugin with icon + color in `app.json`
- **iOS:** APNs key uploaded to Expo; the APNs entitlement is always `development` in the project and Xcode flips it to production for release builds
- **A development build is required** — push notifications have not worked in Expo Go on Android since SDK 53
- iOS notification categories for action buttons ("Log a meal") — post-MVP

---

## 17. Gamification Strategy

### Design ethic (read this before implementing any of it)

Gamification here exists to make a *genuinely difficult daily habit* feel achievable. It must never manufacture anxiety to drive engagement.

- ✅ Celebrate what they did.
- ✅ Make progress visible.
- ✅ Forgive misses.
- ❌ No loss-aversion pressure ("you're about to lose everything!").
- ❌ No guilt, no shame, no red for under-eating.
- ❌ No fake urgency, no artificial scarcity.

If a mechanic only works by making the user feel bad, it doesn't ship. This audience has already spent years feeling bad about their body; the app that finally works for them will be the one that doesn't add to it.

### XP

| Action | XP |
|---|---|
| Log any meal | **+10** (max 5 meals/day counted) |
| Hit the daily calorie goal (≥95%) | **+50** |
| Hit the daily protein goal (≥95%) | **+25** |
| Log weight | **+15** (once/day) |
| Complete all 3 daily tasks | **+20** |
| 7-day streak | **+100** bonus |
| 30-day streak | **+500** bonus |
| First AI scan ever | **+25** |
| Add a progress photo | **+20** (once/week) |

Realistic ceiling: ~150 XP/day for a fully engaged user.

**Level curve** — gentle early, slower later, so week 1 feels fast:

```
xpForLevel(n) = 100 * n^1.5     → L2: 283 · L3: 520 · L5: 1,118 · L10: 3,162 · L20: 8,944
```

Levels are cosmetic (a badge on the XP bar + Profile). No content is gated behind a level — gating progress behind grind is how you lose a beginner in week two. Level-up shows a small celebration sheet with the new badge.

### Streaks

**Definition:** a day counts toward the streak if the user hits **≥80% of their calorie goal**. Deliberately 80%, not 100% — a user who eats 2,800 of 3,140 calories had a genuinely good day, and telling them otherwise is both wrong and demotivating.

**Forgiveness day (the single biggest anti-churn lever in the app):**
- Every user gets **1 forgiveness day per calendar week**.
- Missing a day automatically consumes it: the streak survives, and the day is marked distinctly (grey with a dot) rather than as a hit.
- Copy: *"Streak saved — you had a rest day. 1 more available next week."*
- Without this, one missed day cascades: streak → 0 → user concludes they've failed → uninstall. Duolingo's streak freeze exists for exactly this reason and it's the highest-ROI retention feature in that entire product.

**Streak states:** `active` (🔥 + count) · `at_risk` (nothing logged by 21:00, gentle nudge) · `saved_by_forgiveness` · `broken` (reset to 1 on the next logged day, never to 0 with a scolding message) · `longest` (shown in Profile, never lost).

### Daily tasks

Three tasks per day, visible on Home, auto-ticked by real activity (never a separate manual checkbox — that's busywork):

1. **Log all your meals** — ✓ when ≥3 meals logged
2. **Hit your protein goal** — ✓ at ≥95% protein
3. **Hit your calorie goal** — ✓ at ≥95% calories

Occasionally swap task 1 for a variant to keep it fresh: *"Log your weight"* (if none in 3 days), *"Scan a meal with AI"* (if no scan in 3 days), *"Add a progress photo"* (Sundays). Resets at local midnight. All three complete → +20 XP + a small confetti burst.

### Milestones & celebrations

| Milestone | Celebration |
|---|---|
| First meal logged | Toast + *"That's how it starts."* |
| First AI scan | Sheet + XP |
| Day 7 | Full-screen sheet, badge, **share card** |
| Day 30 | Full-screen sheet, badge, **share card** |
| Day 100 | Full-screen sheet, badge, **share card** |
| First kg gained | Full-screen + *"You've gained your first kilo. That's real."* + **share card** |
| Every 2 kg after | Sheet + share card |
| Target weight reached | Big moment → then prompt to set a new target (retention hand-off) |
| Level up | Small sheet + badge |

Celebration budget: confetti + haptic (`expo-haptics` success notification) + one bold number. Under 2 seconds, always dismissible by tapping anywhere. Every major milestone generates a **shareable card** — this is where gamification feeds §22.

### Anti-patterns explicitly rejected

- No leaderboards at launch (comparison demotivates the person who's furthest behind — i.e. exactly our new user).
- No streak-freeze purchases or any monetized mechanic. Never sell relief from anxiety you created.
- No daily login-only rewards — reward the *behavior* (eating), not app-opening.
- No push notification that exists purely to bump DAU.

---

## 18. MVP Scope & Build Phases

### In / out

| ✅ In MVP | ❌ Not in MVP |
|---|---|
| Google / Apple / email auth | Phone auth, magic links |
| 8-step onboarding + plan math | Multi-goal support, cut/recomp modes |
| Calorie + protein tracking | Micronutrients, water, fiber |
| AI photo scan | Barcode scanning, restaurant DB, voice logging |
| Curated foods library (5 categories) | Meal plans, recipes, grocery lists |
| Weight tracking + charts | Body measurements, body-fat %, HealthKit |
| Streaks + XP + daily tasks | Leaderboards, friends, challenges |
| Local + push notifications | Notification action buttons, Live Activities |
| Paywall + RevenueCat | Promo codes, referrals, web checkout |
| Profile + settings | Dark mode, localization, widgets |
| iOS | Android, web, watchOS |

### Phases

> Each phase ends with a working, demoable build. Nothing is "done" until it runs on a physical device.

#### Phase 0 — Foundation *(highest-risk phase — do not skip the smoke test)*

1. **Install and verify NativeWind first.** `nativewind@4.2.1` + `tailwindcss@3.4.17`, `metro.config.js` `withNativeWind()`, `babel.config.js` preset, `global.css`, `tailwind.config.js`, `nativewind-env.d.ts`.
2. **Styling smoke test:** render `<View className="bg-red-500 p-4 rounded-2xl">` on a device. If it isn't red, **stop and fix the pipeline before writing anything else.** A broken NativeWind build silently no-ops every `className` in the app, and it is far cheaper to find here than after 20 screens.
3. `expo-dev-client` + first EAS dev build on a physical iPhone.
4. `constants/theme.ts` + `tailwind.config.js` mirroring; Inter via `expo-font`.
5. Build the `components/ui/` primitives with a temporary component-gallery route.
6. 4-tab layout with placeholder screens.
7. Sentry + `lib/analytics.ts` stubs.

**Done when:** the dev build runs on a device, all 4 tabs navigate, and the UI gallery renders every primitive with correct tokens.

#### Phase 1 — Auth & backend spine

1. Convex project init; `schema.ts` with all tables.
2. Clerk app; Google + Apple + email providers; `convex` JWT template; iOS bundle ID registered.
3. Provider composition in `app/_layout.tsx`.
4. Welcome / sign-in / sign-up / verify screens.
5. Clerk webhook → `convex/http.ts` → `users.upsertFromClerk`; client-side `users.ensure` safety net.
6. Root redirect gate.

**Done when:** all three sign-in methods work on-device, a `users` row appears in Convex, and killing/reopening the app keeps the session.

#### Phase 2 — Onboarding & plan

1. `lib/nutrition.ts` with unit tests for BMR/TDEE/goals/timeline (pure functions — test these, they're the product's credibility).
2. Zustand onboarding draft.
3. All 8 step screens + `(onboarding)/_layout.tsx` chrome.
4. `lib/units.ts` with kg/lb + cm/ft-in round-trip tests.
5. Plan reveal with the animated count-up.
6. `onboarding.complete` single mutation.

**Done when:** a fresh account completes onboarding, the numbers are hand-verifiable against the formulas, and a killed app mid-onboarding resumes correctly.

#### Phase 3 — Home & manual logging

1. `meals.create/update/remove` with transactional `dailyLogs` recomputation.
2. `dateKey` / timezone handling in `lib/dates.ts` (test the midnight boundary explicitly).
3. Home screen: ring, protein bar, macro row, meals list, weight card.
4. Manual add / edit meal.
5. Streak + XP + daily tasks (`gamification.ts`), including the forgiveness day.
6. All Home states: empty, in-progress, goal-hit, over-goal, loading.

**Done when:** logging, editing, and deleting meals moves the ring correctly; the streak survives one missed day per week; the day rolls over at local midnight.

#### Phase 4 — Foods library

1. Curate `data/foods.seed.json` — ≥10 items × 5 categories, with images.
2. Upload images; `foods.seed` idempotent mutation.
3. Foods screen: chips, grid, search, quick-add.
4. Food detail with serving multiplier.

**Done when:** all 5 categories are populated, quick-add logs in one tap and shows on Home, and search works.

#### Phase 5 — AI scan

1. `ai.generateUploadUrl` + `ai.analyzeMeal` Node action with structured outputs.
2. `lib/image.ts` downscale/compress.
3. Camera screen with all permission states.
4. Analyzing + review sheet with inline macro editing and the portion multiplier.
5. Every failure path: timeout, no-food, network, rate-limit.
6. `aiScans` logging + a cost dashboard query.

**Done when:** 20 real meal photos all produce either a usable estimate or a graceful fallback, p50 latency is under 5s, and no key exists in the client bundle (grep the bundle to confirm).

#### Phase 6 — Monetization, progress, notifications, launch

1. RevenueCat dashboard + products + entitlement + offering; `lib/revenuecat.ts`; `logIn` aliasing.
2. Paywall screen with every state; `PaywallGate`; webhook → Convex.
3. Progress screen: weight chart, heatmap, consistency bars, weekly summary, photos.
4. Notifications: permission, tokens, local scheduling, Convex crons, trial reminder.
5. Profile + all settings screens, including account deletion.
6. Polish: haptics, empty states, error boundaries, App Store assets, TestFlight.

**Done when:** the sandbox purchase checklist in §15 passes end-to-end and TestFlight testers complete a full week without a blocking bug.

### Rough sizing

Two engineers (one product-focused, one backend/integration), ~7–9 weeks to a submittable build. Phase 0 and Phase 6 are consistently underestimated: Phase 0 because of the native build setup, Phase 6 because subscription edge cases are numerous and App Review is unforgiving.

---

## 19. Future Features

**Next (v1.1–1.2)**
- **Android launch** (Play Console, RevenueCat Google config, edge-to-edge is mandatory on SDK 54 Android)
- **Dark mode** — the token architecture makes this a swap
- **"Log again"** — one-tap re-log of a recent or favorite meal (the highest-ROI convenience feature; most people eat the same 10 things)
- **Barcode scanning** — `expo-camera` barcode support + a nutrition DB
- **Widgets** — calories remaining on the home screen; a Live Activity for the daily ring
- **Notification action buttons** — log a shake straight from the banner

**Later (v1.3–2.0)**
- **Apple Health / HealthKit sync** — weight in, calories out
- **AI coach chat** — *"why am I not gaining?"* with real context from the user's data
- **Workout logging** with progressive overload tracking (the natural second half of a bulk)
- **Meal favorites & custom foods** — user-created library
- **Recipe builder** — combine foods into a saved meal
- **Referral loop** — free month for both sides
- **Streak repair** — earn back a broken streak with a good week (never purchasable)
- **Weekly AI check-in** — *"You averaged 2,700 of 3,140. Here's the one change to make."*
- **Localization** — Spanish, Portuguese, Hindi, Arabic
- **Apple Watch** — quick log + ring complication
- **Offline write queue** with explicit conflict resolution
- **Friends / accountability pairs** — opt-in, tiny scope, no public leaderboard

**Explicitly deferred indefinitely:** social feed, influencer marketplace, ecommerce/supplement sales, cutting mode.

---

## 20. App Store Launch Plan

### Identifiers

- Bundle ID: `com.calboost.ai` (or your reserved namespace) — set in `app.json` `ios.bundleIdentifier`
- App name: **CalBoost AI**
- Scheme: `calboost` (already configured)

### App Store Connect setup

1. App record + bundle ID; primary category **Health & Fitness**, secondary **Food & Drink**.
2. Age rating 12+ (health/fitness content). **Do not** claim medical functionality anywhere.
3. Subscription group `CalBoost Premium` with both products; 3-day intro offers; localized display names and descriptions.
4. Privacy: declare data collection — email, name, health/fitness (weight, calories), photos (meal images), usage. Mark linkage to identity honestly. Ship a real privacy policy and terms at public URLs.
5. Sign in with Apple configured (required, since Google sign-in is offered).

### ASO

| Field | Content |
|---|---|
| **Title** (30) | `CalBoost AI: Bulk & Gain` |
| **Subtitle** (30) | `AI calorie tracker to gain` |
| **Keywords** (100) | `bulk,bulking,gain weight,weight gain,skinny,calorie counter,ai food scanner,muscle,surplus,macro` |
| **Promo text** | Rotate seasonally; no resubmission needed |

Description opens with the wedge: *"Most calorie apps help you eat less. CalBoost AI helps you eat enough."* Then the value stack, then how it works in 3 steps, then the required subscription terms block.

### Screenshots (6 frames, in narrative order)

1. **Home with a full ring** — "Know exactly how much more to eat"
2. **AI scan review** — "Snap your meal. We do the math."
3. **Foods library** — "Know what to eat to hit 3,000 calories"
4. **Progress chart trending up** — "Watch the scale finally move"
5. **Streak + XP** — "Stay consistent, even on low-appetite days"
6. **Plan reveal** — "Your personal calorie & protein target"

Real device frames, real (representative) data, one bold caption each. No stock-photo gym models.

### Review risk register (this category gets rejected a lot)

| Risk | Guideline | Mitigation |
|---|---|---|
| Subscription terms not visible | 3.1.2 | Price, period, trial length, and auto-renew disclosure all on the paywall above the fold, with working Terms/Privacy links |
| No restore purchases | 3.1.1 | Restore on paywall **and** Profile |
| No account deletion | 5.1.1(v) | In-app deletion in Settings → Account |
| Missing Sign in with Apple | 4.8 | Implemented, listed first on iOS |
| Health claims | 1.4.1 | Never promise medical outcomes; add *"Estimates only. Not medical advice. Consult a professional."* in onboarding and Profile |
| Vague permission strings | 5.1.1 | Specific purpose strings for camera, photos, notifications |
| AI accuracy complaints | 2.3 | Label estimates as estimates in-product and in the description; don't advertise precision |
| Paywall blocks all function | 3.1.1 / 4.2 | Limited mode exists; `✕` always works |

### Build & release

- **EAS profiles:** `development` (dev client, internal), `preview` (internal distribution for TestFlight-adjacent testing), `production` (store).
- `eas build -p ios --profile production` → `eas submit`.
- **TestFlight:** ~10 internal + 30–50 external testers from the target demographic. Two full weeks minimum — you need to observe real day-7 streak behavior and a real trial expiry, and neither compresses.
- Test explicitly: fresh install, sandbox purchase, sandbox cancel, restore, notification delivery, timezone change, offline.
- **Phased release** (7-day rollout) so a crash spike can be halted.
- EAS Update channels for JS-only hotfixes; keep native builds for native changes only.

### Launch sequence

- **T-4 weeks:** TestFlight opens; start posting content (build an audience *before* you have an app to sell)
- **T-2 weeks:** App Store page ready; submit for review early — expect at least one rejection
- **T-0:** Launch to a warmed audience; Product Hunt + Reddit + TikTok same-day
- **T+1 week:** First iteration on the paywall based on real conversion data
- **T+2 weeks:** First content update to the Foods library (signals a living app)

---

## 21. Retention Strategy

Retention is the whole business. At $24.99/year, acquisition only works if users stay long enough to see a result — and the result *is* the marketing.

### The retention thesis

**A user who sees the scale move will not churn.** So every retention mechanic serves one goal: keep them logging long enough for the scale to move (2–4 weeks). Everything below is in service of surviving that window.

### Day 0–1 — get to first value fast

- Onboarding must complete in under 90 seconds.
- The plan reveal delivers a concrete, personal number — that's the "aha".
- **First meal logged within 10 minutes of install** is the single strongest predictor of D7. If Home is empty 10 minutes after onboarding, the empty state becomes more prominent and a gentle notification fires 2 hours later.
- Push permission earned during onboarding, not after.

### Day 2–7 — build the habit

- 3 daily tasks make "done for today" a clear, achievable state.
- Day 7 streak → celebration + share card (retention *and* acquisition in one moment).
- Notification cadence: morning target, evening gap, shake reminder.
- **First-week weight log prompt** — establishes the baseline the chart needs.

### Day 8–30 — prove it's working

- Weekly summary notification with the real numbers.
- Weight chart with the moving average starts showing an actual trend.
- **First-kg milestone** — the highest-emotion moment in the product; make it big.
- Auto goal recalculation as they gain: *"You've gained 2 kg — your target is now 3,220 calories."* This makes the app feel alive and responsive rather than static.
- Day 30 badge + share card.

### Day 30+ — sustain

- New target prompt when they hit their goal (never let the product "end").
- Monthly transformation compare (first photo vs. latest).
- Longest-streak tracking gives something to beat.
- Content updates to the Foods library.

### Churn interventions

| Signal | Response |
|---|---|
| No log for 1 day, streak ≥3 | Streak-at-risk push at 21:00 (once, gentle) |
| No log for 3 days | *"Your plan is still here"* + one-tap "log yesterday" |
| No log for 7 days | Re-engagement: *"Restart your streak — day 1 counts the same as day 100"* |
| No log for 14 days | Win-back with a specific value reminder; ask what went wrong (one-tap survey) |
| Trial about to expire, low engagement | Value recap notification highlighting what they *did* do |
| Subscription cancelled | Exit survey (one tap, 4 options) + *"your data stays for 90 days"* |
| Weight plateau ≥3 weeks | *"Plateaus are normal. Try +200 calories."* — proactive coaching prevents "this doesn't work" churn |

### Instrumentation to find the leak

Cohort D1/D7/D30 by acquisition source, onboarding step drop-off, time-to-first-meal, meals/day distribution, scan-vs-manual mix, notification open rates by category, paywall view→purchase by entry point, trial→paid by day-3 engagement level.

**Run a weekly ritual:** pick the single largest drop-off in the funnel and fix only that. Retention work is sequential, not parallel.

---

## 22. Viral & Social Strategy

The audience lives on short-form video, and "skinny guy gains weight" is one of the most watchable transformation formats that exists. Distribution is a content problem, not an ads problem — especially at a $24.99 annual price point where paid CAC is punishing.

### Primary channel: TikTok / Reels / Shorts

**The hook that does the work:**

> *"You're not skinny. You're just not in a surplus."*

It's contrarian, it reframes a personal failing as a solvable math problem, and it implies a tool. Every video ends on the app doing the math.

**Content pillars (post 1–2×/day from a founder account, not a brand account):**

1. **Myth-busting** — "You don't have a fast metabolism, you have a small appetite" · "You're eating 1,800 calories and calling it 3,000"
2. **Calorie reveals** — film a normal-looking meal, scan it, reveal the number. Native, addictive, and it *is* the product demo.
3. **"How to eat 3,000 calories"** — 60-second high-calorie meal ideas straight from the Foods library
4. **Transformations** — user before/afters (with permission), day-30 and day-90 check-ins
5. **Build-in-public** — founder journey, MRR, feature building. Attracts the self-improvement audience specifically.
6. **Streak content** — "Day 47 of eating in a surplus"

**Cadence over polish.** Vertical, phone-shot, subtitled, hook in the first 1.5 seconds. Screen-record the app; do not make ads.

### In-app shareable moments (the loop)

Every card is generated in-app, watermarked with the app name, and sized 1080×1920 for stories:

| Trigger | Card |
|---|---|
| Day 7 / 30 / 100 streak | Streak badge + day count |
| First kg / every 2 kg | Weight gained + timeframe |
| Weekly summary | Days hit, avg calories, weight Δ |
| Target reached | Before → after, with the timeline |
| Progress photos | Side-by-side compare |

Sharing is **outbound-only** — no in-app feed, no comments, no follower graph. Cheap to build, no moderation burden, and it puts the app in front of exactly the right audience (their friends, who are also skinny).

### Community

- **Reddit** — r/gainit, r/GainWeight, r/skinnyfat. Participate genuinely for weeks before mentioning the app once. This community will detect and punish marketing instantly, but it's also the highest-intent audience on the internet for this product.
- **Discord** — a small accountability server; daily check-in channel. High-touch, high-retention, and a free source of feature feedback.
- **Creator seeding** — micro-creators (10k–100k) in the skinny-to-strong niche. Free lifetime accounts, no scripts, honest reviews. Their audience is the target demographic almost perfectly.

### Referral (fast-follow, v1.2)

Both sides get a free month. Surfaced right after a milestone celebration — the moment when the user actually feels like recommending it.

### What not to do

- ❌ Don't buy installs before retention is proven — you'll be paying to fill a leaky bucket.
- ❌ Don't fake transformations or reviews. This niche is deeply skeptical and it will be found out.
- ❌ Don't build a social feed. Moderation cost, and comparison hurts the beginner.
- ❌ Don't use shame-based marketing ("stop being weak"). It converts a few and repels the Aishas — who are a third of the market.

---

## 23. Architecture & Scalability

### Data flow

```
┌──────────────────────────── Client (Expo / RN) ─────────────────────────────┐
│  Screens (expo-router)                                                      │
│      │ compose only                                                         │
│  components/ui  ← constants/theme.ts (tokens)                               │
│      │                                                                      │
│  hooks/ ── useQuery / useMutation ──┐        Zustand: onboarding draft +     │
│                                     │        transient UI state only         │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │ WebSocket (reactive subscriptions)
┌─────────────────────────────────────▼───────────── Convex ──────────────────┐
│  queries   (reads, reactive, auto-invalidated)                              │
│  mutations (transactional writes — meal + dailyLog + XP + streak atomically)│
│  actions   ("use node" — OpenAI; the only place external calls happen)      │
│  http      (Clerk + RevenueCat webhooks)                                    │
│  crons     (dynamic pushes, streak alerts, weekly summaries, win-back)      │
│  storage   (meal photos, progress photos, food images)                      │
└──────┬──────────────────┬───────────────────┬───────────────────────────────┘
       │                  │                   │
   Clerk (identity)   OpenAI (vision)   Expo Push · RevenueCat (webhook)
```

**There is no client cache layer, and that's deliberate.** Convex's `useQuery` is a live subscription — it re-renders when the server data changes, on its own. Adding React Query or Redux on top would mean maintaining two caches and reconciling them. The rule: **server data comes from `useQuery`, always.**

### Why `dailyLogs` is denormalized

The naive design computes today's total by reading all of a user's meals and summing. That query gets slower every single day the user stays — the users you most want to keep get the worst experience. Instead:

- `meals.create` writes the meal **and** updates the one `dailyLogs` row in the same transaction.
- Home reads exactly one indexed document.
- Charts read a bounded range of `dailyLogs`, never the `meals` table.
- The goal is snapshotted per-day, so history stays truthful when goals change.

**Rule: never `.collect()` an unbounded user-scoped table in a query that renders on a hot path.** Always go through an index with a bounded range.

### AI cost control (the only variable cost that scales with usage)

| Lever | Impact |
|---|---|
| 1024px / q=0.7 images | Largest single lever on both tokens and latency |
| Cheapest viable vision model, in a Convex env var | Swappable without an app release |
| Idempotency on `storageId` | Never pay twice for a retry |
| Per-user daily cap (20 premium / 3 lifetime free) | Bounds worst-case spend per user |
| Server-side entitlement check | Prevents free riders on a paid API |
| `aiScans` cost logging + `userEditedResult` | Watch cost *and* accuracy; the edit rate tells you when to change models |

**Alert threshold:** if blended AI cost per subscriber exceeds ~10% of ARPU, act. Levers in order: image size → model tier → daily cap → cached repeat meals.

### Convex discipline

- Keep functions small and single-purpose; put shared logic in `convex/lib/` helpers, not in giant multi-purpose mutations.
- **Every** function starts by resolving `ctx.auth.getUserIdentity()` and scoping to that user. No function ever accepts a `userId` argument from the client.
- Use `internal*` functions for anything callable only by webhooks, crons, or actions.
- Index every query — a missing index on a growing table is a latency time bomb.
- Paginate meal history and photo grids (`paginationOpts`).
- Schedule fan-out work (`ctx.scheduler`) rather than looping thousands of users inside one cron invocation.

### Error handling & observability

- **Sentry** for JS + native crashes, with the Convex request id attached to reports.
- Error boundaries per tab so one broken chart doesn't white-screen the app.
- `ConvexError` with typed codes for anything the UI needs to distinguish (`SCAN_LIMIT_REACHED`, `NOT_PREMIUM`).
- Every AI failure logged to `aiScans` — that table *is* the AI observability dashboard.
- Analytics events (§3) via one typed emitter in `lib/analytics.ts`, so the provider can be swapped once.

### Scaling considerations

| Concern | Approach |
|---|---|
| Read volume | Convex subscriptions + one-row hot reads; `foods` list is small and cacheable |
| Write volume | ~5–10 writes/user/day. Trivial. |
| Image storage | 1024px JPEGs ≈ 200KB. Prune meal photos older than 90 days for free users (disclosed in the privacy policy); keep progress photos forever. |
| Cron fan-out | Bucket users by timezone; schedule per-bucket jobs; use the scheduler for per-user sends |
| Push volume | Expo Push handles batching; deactivate `DeviceNotRegistered` tokens promptly |
| Cold start | Native splash held until Clerk + the first Convex query resolve; skeletons after |
| Bundle size | SVG charts instead of Skia; `expo-image` for caching; no moment.js; avoid icon-set sprawl |
| Android later | Token architecture + NativeWind means UI ports cleanly; edge-to-edge is forced on SDK 54 Android, so test insets early |
| Team scaling | Feature-folder components + pure `lib/` functions means two engineers rarely touch the same file |

### Testing strategy

- **Unit (Jest):** `lib/nutrition.ts`, `lib/units.ts`, `lib/dates.ts`, `lib/xp.ts`. These are pure, they encode the product's credibility, and they're cheap to test. Non-negotiable.
- **Convex function tests:** `meals.create` → `dailyLogs` correctness; streak transitions including the forgiveness day.
- **Manual device matrix:** smallest supported iPhone (SE) + a Pro Max; the full sandbox purchase checklist; timezone change; airplane mode; permission-denied paths.
- No E2E harness for the MVP — it's not worth the setup cost at two engineers. Revisit at v1.2.

---

## 24. Appendix: Critical Build Warnings

Five things that will cost days if discovered late. Read before Phase 0.

### ⚠️ 1. NativeWind × Reanimated 4 — pin your versions

Expo SDK 54 ships `react-native-reanimated@~4.1.1`. NativeWind v4's documentation still targets Reanimated 3, and NativeWind v5 (Tailwind v4 + `react-native-css`) is the forward path but has a rough migration.

**Do this:** install exactly `nativewind@4.2.1` + `tailwindcss@3.4.17`, then run the red-box styling smoke test on a device **before writing any other UI**.

**Why it matters:** when the NativeWind pipeline is misconfigured, `className` props are silently ignored — no error, no warning, just unstyled views. Finding that after building 20 screens is a bad day. Finding it in the first hour costs nothing.

**Fallback if it can't be made to work:** NativeWind v5 + Tailwind v4, or plain `StyleSheet` consuming the same `constants/theme.ts`. Because every screen composes primitives and tokens, this fallback is a contained change — which is precisely why the design system is structured that way.

### ⚠️ 2. You need a development build from day one

Three independent reasons, any one of which is sufficient:
- **RevenueCat** has native modules that cannot run in Expo Go, and requires a full rebuild after install (hot reload throws).
- **Clerk's native `<AuthView />`** requires a dev client.
- **Push notifications** have been unavailable in Expo Go on Android since SDK 53.

Set up `expo-dev-client` and an EAS dev build in Phase 0. Do not build three phases in Expo Go and then discover this.

### ⚠️ 3. The OpenAI key must never reach the client

It lives in **Convex environment variables** and is used only inside a `"use node"` action. Never `EXPO_PUBLIC_*`, never `app.json`, never a client-side `fetch` to OpenAI.

**Verify before shipping:** build the production bundle and grep it for the key prefix. A leaked key in a shipped binary can't be fixed without a forced update, and it will be found and used.

### ⚠️ 4. Verify third-party API surfaces before coding against them

Three moving targets:
- **Clerk's Expo package** — `@clerk/expo` (formerly `@clerk/clerk-expo`); confirm the package name, `AuthView` props, and token-cache path against the live quickstart.
- **The OpenAI vision model id** — these change every few months. Keep it in a Convex env var so it can be rotated without an app release.
- **Convex + Clerk in Expo** — Convex's docs cover React/Next/TanStack, not Expo specifically; follow the React instructions with `useAuth` from `@clerk/expo`.

Per `AGENTS.md`: read the exact versioned Expo docs at `https://docs.expo.dev/versions/v54.0.0/` before writing code against any Expo module.

### ⚠️ 5. Entitlements must be enforced server-side

AI scans cost real money per call. Client-reported `isPremium` is a suggestion, not a fact. `ai.analyzeMeal` re-checks `users.isPremium` and `scansUsed` in Convex on every single call, backed by the RevenueCat webhook mirror. The client's entitlement state drives *UI only*.

---

## Quick reference

| Thing | Value |
|---|---|
| App name | **CalBoost AI** |
| Tabs | Home · Foods · Progress · Profile |
| Food categories | Breakfast · Lunch · Dinner · Snacks · Shakes |
| Onboarding questions | gender · height · current weight · target weight · activity · gym experience · goal type |
| Computed at onboarding | daily calorie goal · protein goal · timeline to target |
| Pricing | 3-day trial · **$8.99/mo** · **$24.99/yr** |
| Entitlement | `premium` |
| Streak threshold | ≥80% of calorie goal · 1 forgiveness day/week |
| Goal-hit threshold | ≥95% of calorie goal |
| Platform | iOS first, Android later |
| North star | Weekly Consistent Users (≥80% of goal on ≥5 of 7 days) |

---

*End of specification. Next step: Phase 0 — install NativeWind, run the styling smoke test, and reconcile `constants/theme.ts` against the `/design` references.*



