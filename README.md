# Image Management API

Une API pour gérer les images avec des fonctionnalités telles que le téléchargement de fichiers, la recherche, la pagination, et l'intégration avec Firebase pour le stockage des fichiers et une API externe pour la génération de mots-clés.

## Lancer le Projet

### 1. Préparer le Modèle de Génération de Légendes

Avant de démarrer l'API, tu dois préparer et exécuter le modèle de génération de légendes d'images. Suis ces étapes pour construire et déployer le modèle en utilisant Docker :

1. **Cloner le dépôt du modèle :**

   ```bash
   git clone https://github.com/IBM/MAX-Image-Caption-Generator.git

    cd MAX-Image-Caption-Generator
   ```

2. **Construire l'image Docker :**

   ```bash
   docker build -t max-image-caption-generator .
   ```

3. **Lancer le conteneur Docker :**

   ```bash
   docker run -it -p 5000:5000 max-image-caption-generator
   ```

4. **Tester le modèle :**

   ```bash
   curl -F "image=@/path/to/image.jpg" -X POST http://localhost:5000/model/predict
   ```

### 2. Configurer les Variables d'Environnement

Crée un fichier `.env` à la racine du projet et ajoute les variables d'environnement suivantes :

```bash
DB_NAME=""
DB_USER=""
DB_PASSWORD=""
DB_HOST=""
DB_PORT=""

PROJECT_ID=""
PRIVATE_KEY=""
CLIENT_EMAIL=""

FIREBASE_BUCKET_NAME=""
```

### 3. Installer les Dépendances

Pour installer les dépendances du projet, exécute la commande suivante :

```bash
npm install || yarn install
```

### 4. Démarrer le Serveur

```bash
npm dev || yarn dev
```
