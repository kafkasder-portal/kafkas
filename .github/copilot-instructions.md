# Copilot Agent Instructions for Kafkas Derneği Portal

## 🏗️ Big Picture Architecture

- **Frontend:** React 18 + Vite, all code in `src/`
- **Main App:** `src/App.jsx` is the entry point; routes/pages in `src/pages/`
- **Reusable Components:** Located in `src/components/` (e.g., `Sidebar.jsx`, `DeviceInfo.jsx`)
- **State Management:** React Contexts in `src/contexts/` (e.g., `AuthContext.jsx`, `NotificationContext.jsx`)
- **Hooks:** Custom hooks in `src/hooks/` (e.g., `useDeviceDetection.js`)
- **Localization:** i18n setup in `src/i18n/` with JSON locale files
- **Services:** API/service logic in `src/services/`
- **Styling:** CSS modules and global styles in `src/animations.css`, `App.css`, etc.

## 🔄 Data Flow & Integration

- **Context Providers** wrap the app for auth and notifications
- **Pages** use context/hooks for data and actions
- **Services** handle API calls and notifications
- **Localization** uses context + JSON files for multi-language support
- **QR/Kamera:** QR code and camera features in `PiggyBankTracking.jsx` and related components

## 🛠️ Developer Workflows

- **Dev Server:** `npm run dev` (Vite) or `Ctrl+Shift+D`
- **Build:** `npm run build` or `Ctrl+Shift+B`
- **Lint:** `npm run lint` or `Ctrl+Shift+L` (ESLint)
- **Preview:** `npm run preview`
- **Clean Install:** `Ctrl+Shift+C`
- **Debug:** Use VS Code launch configs in `.vscode/launch.json` (Node/Chrome)
- **Node Version:** Use `.nvmrc` (recommended: v18+)

## 🚀 VS Code Shortcuts & Snippets

- **Quick Commands:** `dev`, `build`, `i`, `v`, `gs`, `ga`, `gc`, `gp` (PowerShell aliases)
- **React Snippets:** `rfc` (component), `rue` (useEffect), `rus` (useState), `cl` (console.log)
- **Keyboard Shortcuts:** Use `Ctrl+Shift+D` for dev server, `Ctrl+Shift+T` for new terminal

## 🧩 Project Conventions

- **Component Naming:** PascalCase for React components
- **File Structure:** Pages in `src/pages/`, reusable components in `src/components/`
- **Context Usage:** All global state via React Contexts
- **Localization:** All text via i18n context and JSON files
- **Service Pattern:** API/service logic separated in `src/services/`
- **CSS:** Prefer module CSS for components, global for layout

## 🔗 Integration Points

- **External APIs:** Notification service, camera/QR features, Google Maps (location tracking)
- **Auth:** Context-based, see `src/contexts/AuthContext.jsx`
- **Notifications:** Context + service, see `src/contexts/NotificationContext.jsx` and `src/services/notificationService.js`
- **Localization:** i18n context, see `src/i18n/`

## ⚡ Examples

- **Add a new page:** Create in `src/pages/`, add route in `App.jsx`
- **Add a new context:** Create in `src/contexts/`, wrap in `App.jsx`
- **Add a new service:** Create in `src/services/`, import where needed
- **Add a new locale:** Add JSON file to `src/i18n/locales/`, update i18n config

## 🚨 Patterns to Follow

- Always use context for global state
- Use hooks for device/browser detection
- Use service files for API logic
- Use i18n for all user-facing text
- Keep components small and focused

---

For more details, see `README.md` and `.vscode/launch.json` for debug/build info.
