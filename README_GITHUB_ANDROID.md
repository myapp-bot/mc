# Mada Commerce Premium V2 — GitHub + Android Studio

Ce dépôt contient les sources web, Capacitor et le projet Android.

## GitHub
1. Envoyer **tout le contenu de ce dossier** à la racine du dépôt (notamment `package.json`, ``src`, `android` et `.github`).
2. Ouvrir **Actions > Build Mada Commerce APK > Run workflow**.
3. Une fois terminé, télécharger l'artifact **Mada-Commerce-Premium-V2-debug**.

## Android Studio
Prérequis : Node.js 20+, npm et Android Studio/JDK 21.

À la racine :
```
npm install
npm run build
npx cap sync android
```
Puis ouvrir le dossier `android` dans Android Studio.

## Après une modification de l'application
Modifier `src/app.html`, puis relancer :
```
npm run build
npx cap sync android
```

## Important
Ne jamais supprimer `package.json` / `package-lock.json`. Le module Android de Capacitor est fourni par `node_modules/@capacitor/android` après `npm install`.
