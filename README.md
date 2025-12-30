# TrialToggle SaaS Demo 🚀

A mini SaaS demonstration featuring a feature-flag driven trial system. This project showcases how an admin can dynamically switch the entire platform's monetization strategy (Usage-based vs. Time-based) without a redeploy.

## 🎯 Project Goal
Demonstrate a realistic SaaS backend + frontend interaction where trial logic is centralized, extensible, and controlled via an administrative dashboard.

---

## 🔁 Trial Modes

The system operates in **one of two** global modes at any given time:

### ✅ Mode A: Free Predictions (Usage-Based)
*   **Limit:** 3 free predictions total.
*   **Constraint:** Users are blocked immediately after their 3rd successful prediction.
*   **Best For:** High-cost per-unit services (e.g., specialized AI generation).

### ✅ Mode B: Free Days (Time-Based)
*   **Limit:** 3 days of access.
*   **Constraint:** Users have unlimited predictions during their trial window but are blocked once the clock runs out.
*   **Best For:** Content platforms or high-volume utility tools.

---

## 🔑 Roles

### 👤 User
*   **Onboarding:** Register/Login via email (auto-seeds if new).
*   **Interaction:** Perform AI "Predictions" using the Predictor Hub.
*   **Visibility:** A real-time `TrialBanner` informs the user of their remaining usage or time.
*   **Restriction:** Access to the AI engine is cut off automatically when trial limits are reached.

### 🛡 Admin
*   **Global Toggle:** Instantly switch between Mode A and Mode B.
*   **Analytics:** View total users, active trials, and total API consumption.
*   **User Management:** A detailed table showing every user's role, creation date, usage, and current block status.

---

## 🛠 Tech Stack

-   **Frontend:** React 19, TypeScript, Vite.
-   **Styling:** Tailwind CSS (Modern indigo/slate palette).
-   **AI Engine:** Google Gemini API (`gemini-3-flash-preview`) for "Predictions".
-   **Backend (Simulated):** A robust `backendService.ts` utilizing `LocalStorage` for persistence across sessions.
-   **Authentication:** Simulated JWT flow with Base64 tokens.

---

## 🗂 Key Components

### 1. `backendService.ts`
The brain of the app. It handles trial enforcement logic, configuration management, and user statistics. By centralizing the `makePrediction` check here, we ensure the UI can never bypass the trial limits.

### 2. `App.tsx` (AuthContext)
Provides global state for the authenticated user and the current `TrialConfig`. This allows components like the `TrialBanner` to update instantly when an admin changes settings.

### 3. `TrialBanner.tsx`
A context-aware UI component that calculates "Remaining Days" or "Remaining Usage" based on the current global mode.

### 4. `Dashboard.tsx`
The primary workspace where users interact with the Gemini AI. It includes error handling for trial expiration.

---

## 🚀 How to Use

1.  **Login as a User:** Use `user@demo.com`. Try making 3 predictions.
2.  **View Limits:** Notice the banner counting down. After 3, you'll be blocked.
3.  **Login as Admin:** Use `admin@demo.com`.
4.  **Toggle Mode:** Switch to "Time-Based".
5.  **Observe Change:** Go back to the User dashboard. Notice the limits have shifted from "Usage" to "Days Remaining".

---

## 🧠 Core Architectural Concept: Feature Flags
In a production app, the `TrialConfig` would be fetched from a configuration service (like LaunchDarkly or a custom Redis-backed API). This demo simulates that by making the `TrialConfig` a globally reactive piece of state that affects the backend validation logic.

