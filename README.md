# Image Management API

Une API pour gérer les images avec des fonctionnalités telles que le téléchargement de fichiers, la recherche, la pagination, et l'intégration avec Firebase pour le stockage des fichiers et une API externe pour la génération de mots-clés avec l'utilisation de rabbitmq.

## Lancer le Projet

##### Configurer les Variables d'Environnement

Crée un fichier `.env` à la racine du projet et ajoute les variables d'environnement suivantes :

```bash
DB_NAME="image_search"
DB_USER="root"
DB_PASSWORD="root"
DB_HOST="localhost"
DB_PORT="3306"

RABBITMQ_ADMIN_USER="rabbitmqadmin"
RABBITMQ_ADMIN_PASSWORD="rabbitmqpassword"
RABBITMQ_HOST="localhost"
RABBITMQ_PORT="5672"

IMAGE_CAPTION_GENERATOR_HOST="localhost"
IMAGE_CAPTION_GENERATOR_PORT="8081"

PROJECT_ID=""
PRIVATE_KEY=""

FIREBASE_BUCKET_NAME=""
```

##### Installation du projet via docker

1. **Cloner le dépôt du modèle :**

   ```bash
   git clone https://github.com/Technical-Test-Olky/back.git

   cd back

   bash ./setup.sh
   ```

**Lancer le projet :**

Lancer sur votre terminal l'api

```bash
yarn dev
```

**Lancer le trigger de rabbitmq:**

```bash
yarn ts-node rabbitmq_trigger/sub.ts
```

**Tester l'api via Postman:**

```bash
Doc : https://documenter.getpostman.com/view/9261387/2sAXjNZX7E
```
