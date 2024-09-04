# Image Management API

Cette API permet de gérer les images avec des fonctionnalités telles que le téléchargement de fichiers, la recherche, la pagination, et l'intégration avec Firebase pour le stockage, ainsi qu'une API externe pour la génération de mots-clés. Le système utilise RabbitMQ pour la gestion des messages.

## Lancer le Projet

### 1. Installation

1. **Cloner le dépôt du projet :**

   ```bash
   git clone https://github.com/Technical-Test-Olky/back.git
   cd back
   bash ./setup.sh
   ```

### 2. Configurer les Variables d'Environnement

Créez un fichier `.env` à la racine du projet et ajoutez-y les variables d'environnement suivantes :

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
CLIENT_EMAIL=""

FIREBASE_BUCKET_NAME=""
```

### 3. Lancer l'API

Pour démarrer l'API, exécutez la commande suivante dans votre terminal :

```bash
yarn dev
```

### 4. Lancer le Trigger de RabbitMQ

Pour lancer le service RabbitMQ qui gère les messages, exécutez :

```bash
yarn ts-node rabbitmq_trigger/sub.ts
```

### 5. Tester l'API via Postman

Vous pouvez tester les différentes routes de l'API via Postman en utilisant la documentation suivante :

[Documentation Postman](https://documenter.getpostman.com/view/9261387/2sAXjNZX7E)

### 6. Installation du Frontend

Pour installer le projet frontend associé, suivez les instructions du dépôt suivant :

```bash
https://github.com/Technical-Test-Olky/front.git
```
