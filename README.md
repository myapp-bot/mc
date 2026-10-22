# Mada Commerce — Gestion Commerciale Web, PWA & Android pour Madagascar

**Mada Commerce** est une application complète de gestion commerciale bilingue (**Français / Malagasy**) conçue pour les petits commerçants et entrepreneurs de Madagascar vendant sur **Facebook (Pages & Marketplace), Messenger, WhatsApp, en boutique physique et par téléphone**.

---

## 1. Architecture & Comparaison de Base de Données (Partie 3)

| Critère | Firebase (Firestore + Firebase Auth) **[Choix retenu]** | PostgreSQL (Supabase / Cloud SQL) |
| :--- | :--- | :--- |
| **Fonctionnement hors ligne** | **Natif (`persistentLocalCache` + IndexedDB)** : lecture et écriture hors ligne automatiques sur Web et Android. | Nécessite une couche de réplication locale complexe côté client. |
| **Coûts & Limites gratuites** | **Gratuit (Spark / Free tier)** : 50 000 lectures/jour, 20 000 écritures/jour, 1 Go de stockage, Auth illimitée. | Limite de pause après inactivité ou coût mensuel d'instance active. |
| **Compatibilité Android (Capacitor)** | Excellente : fonctionne directement depuis l'APK autonome sans serveur intermédiaire obligatoire. | Requiert une API backend intermédiaire permanente. |
| **Isolation Multi-Commerçants** | Règles `firestore.rules` vérifiant `shopId`, `ownerId` et les rôles (`owner`, `admin`, `staff`) à chaque requête. | Row-Level Security (RLS) SQL. |

---

## 2. Règles Comptables & Financières Appliquées (Parties 8, 12, 13, 15)

1. **Distinction stricte des ventes** :
   - Les commandes au statut **Brouillon (`draft`)**, **Annulée (`cancelled`)** ou **Retournée (`returned`)** ne sont **jamais** comptabilisées dans le Chiffre d'Affaires réalisé.
2. **Absence de double déduction des stocks** :
   - Les dépenses de catégorie **Achat de marchandises (`merchandise`)** augmentent la valeur du stock mais ne sont **pas** déduites une seconde fois dans les dépenses opérationnelles.
   - Lorsqu'une commande est réalisée, le **Coût d'Achat des Marchandises Vendues (COGS)** est calculé à partir du prix d'achat unitaire des articles vendus.
   - **Marge Brute** = $\text{Chiffre d'Affaires Réalisé} - \text{COGS} - \text{Coût Réel de Livraison}$.
   - **Bénéfice Net Estimé** = $\text{Marge Brute} - \text{Dépenses Opérationnelles (hors achats de marchandises)}$.
3. **Encaissements & Créances** :
   - Chaque commande calcule de façon déterministe : $\text{Reste à payer} = \max(0, \text{Total} - \text{Montant payé})$.
   - Les paiements Mobile Money (**MVola**, **Orange Money**, **Airtel Money**) enregistrent la référence de transaction à des fins de pointage comptable (sans prétendre débiter automatiquement le compte Mobile Money du client sans API opérateur).

---

## 3. Lancement en Développement et en Production (Partie 2.D)

### Prérequis
- Node.js 20+
- Un projet Firebase configuré (`firebase-applet-config.json` généré automatiquement).
- Pour la connexion par e-mail/mot de passe en plus de Google Sign-In : activez le fournisseur **Email/Password** dans *Firebase Console > Authentication > Sign-in method*.

### Commandes utiles
```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (port 3000)
npm run dev

# Exécuter les tests automatisés (calculs financiers, téléphones malgaches, sécurité Firestore)
npm test

# Vérifier les règles de sécurité Firestore avec ESLint
npx eslint firestore.rules

# Compiler pour la production Web / PWA
npm run build
```

---

## 4. Génération, Signature et Installation de l'APK Android Natif (Parties 2.C & 17)

> **Note importante de transparence** : L'environnement cloud Google AI Studio exécute Node.js mais ne contient pas le SDK Android (Java JDK / Android Gradle SDK) permettant de compiler directement un binaire `.apk` sur le serveur d'aperçu. Le projet Android natif complet (`mg.madacommerce.app`) est prêt dans le dossier `/android` et configuré avec **Capacitor**.

### Étape 1 : Synchroniser le build Web vers le projet Android
Sur votre ordinateur (avec Android Studio installé) :
```bash
npm run build
npx cap sync android
```

### Étape 2 : Créer votre clé de signature de production (Keystore)
Exécutez une seule fois la commande suivante pour générer votre certificat de signature privé :
```bash
keytool -genkey -v -keystore android/madacommerce-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias madacommerce
```
Copiez ensuite `android/keystore.properties.example` vers `android/keystore.properties` et renseignez vos mots de passe (ne committez jamais `keystore.properties` ni le fichier `.jks`).

### Étape 3 : Compiler l'APK signé ou le bundle AAB (Google Play)
```bash
cd android

# Générer l'APK signé installable directement sur téléphone Android :
./gradlew assembleRelease
# Fichier produit : android/app/build/outputs/apk/release/app-release.apk

# Ou générer le format AAB pour publication sur Google Play Store :
./gradlew bundleRelease
# Fichier produit : android/app/build/outputs/bundle/release/app-release.aab
```

### Étape 4 : Installation et mise à jour sur téléphone Android
- **Installation directe** : Transférez `app-release.apk` sur votre téléphone Android ou installez-le par câble USB via `adb install -r app-release.apk`.
- **Avant toute mise à jour** : Ouvrez l'onglet **Sauvegarde Cloud** dans Mada Commerce et cliquez sur **Sauvegarder maintenant dans le Cloud** ET **Exporter fichier JSON local**. Incrémentez `versionCode` et `versionName` dans `android/app/build.gradle` avant de compiler la nouvelle version.

---

## 5. Sauvegarde Cloud, Mode Hors Ligne & Restauration (Parties 18 & 19)

1. **Mode Hors Ligne (`IndexedDB` + File d'attente)** :
   - Les produits, clients, commandes, paiements et dépenses déjà chargés restent consultables sans Internet.
   - Toute création ou modification effectuée hors ligne est stockée dans la base locale `IndexedDB` (`mada_commerce_idb_v1`) et ajoutée à la file d'attente `sync_queue`.
   - Dès le retour de la connexion Internet, la file d'attente est automatiquement envoyée vers Firestore.
2. **Sauvegarde Cloud Vérifiée** :
   - L'application n'affiche **« Sauvegarde Cloud confirmée »** qu'après lecture effective sur le serveur distant (`getDocFromServer`).
   - Avant toute restauration d'une sauvegarde antérieure, une sauvegarde de sécurité (`pre_restore`) est créée automatiquement.
   - L'import local JSON vérifie la somme de contrôle (`checksum`) avant d'appliquer les données.

---

## 6. Politique de Confidentialité (Modèle à compléter avant lancement public — Partie 20)

- **Responsable du traitement** : [Nom du Commerce / Société à Madagascar — NIF / STAT].
- **Données collectées** : Nom, numéro de téléphone (032/033/034/037/038), quartier/commune et historique de commandes des clients, strictement nécessaires à la préparation, la facturation et la livraison des commandes.
- **Isolation et sécurité** : Chaque commerce possède un identifiant unique (`shopId`). Les règles de sécurité Firestore interdisent formellement à un commerçant d'accéder aux données d'un autre commerce. Aucune donnée personnelle de client n'est vendue, partagée à des tiers non autorisés ou exposée dans des journaux publics.
- **Droits des utilisateurs et clients** : Tout commerçant peut exporter l'intégralité de ses données en CSV/JSON ou demander la suppression définitive de son compte depuis l'onglet **Paramètres > Sécurité**.
