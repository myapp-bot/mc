# Mada Commerce — Projet Android Natif (Capacitor)

Projet Android complet pour **Mada Commerce** (`mg.madacommerce.app`).

---

## 🚀 Comment ouvrir et compiler dans Android Studio

### Méthode 1 : Avec Android Studio (Recommandé)
1. Téléchargez et installez [Android Studio](https://developer.android.com/studio).
2. Lancez Android Studio et choisissez **Open...**.
3. Sélectionnez le dossier `android` extrait de cette archive.
4. Android Studio va synchroniser le projet Gradle automatiquement (Gradle 8.2).
5. Pour générer l'APK :
   - Allez dans le menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Dès la fin de la compilation, une notification apparaîtra : cliquez sur **locate** pour trouver `app-debug.apk`.
   - Transférez ce fichier sur votre téléphone Android et installez-le !

---

### Méthode 2 : En ligne de commande (Terminal / Invite de commandes)

```bash
# Se placer dans le dossier android
cd android

# Compiler l'APK Debug :
./gradlew assembleDebug       # Linux / macOS
gradlew.bat assembleDebug     # Windows
```

Le fichier APK compilé est disponible dans :
📁 `android/app/build/outputs/apk/debug/app-debug.apk`

---

### Méthode 3 : Générer l'APK de Production signé (Release)

1. Générez une clé privée (si vous ne l'avez pas déjà fait) :
   ```bash
   keytool -genkey -v -keystore madacommerce-release-key.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias madacommerce
   ```
2. Créez le fichier `keystore.properties` à partir de `keystore.properties.example` avec vos mots de passe.
3. Lancez :
   ```bash
   ./gradlew assembleRelease
   ```
   L'APK signé sera dans :
   📁 `android/app/build/outputs/apk/release/app-release.apk`

---

## 📱 Caractéristiques de l'application
- **Package ID** : `mg.madacommerce.app`
- **Nom affiché** : Mada Commerce
- **Target SDK** : 34 (Android 14)
- **Min SDK** : 24 (Android 7.0 Nougat+)
- **Mode hors-ligne** : Oui (IndexedDB local natif)
- **Sauvegarde Cloud** : Oui (Firestore sync automatique)
