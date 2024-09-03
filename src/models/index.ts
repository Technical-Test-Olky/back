require("dotenv").config();
import { Sequelize } from "sequelize";
import { ImageModel } from "./image.model";
import { KeyImageModel } from "./key.model";
import { connectSQLServer } from "../config/sequelize.config";

const Database: any = {};

// Build database
Database.Sequelize = Sequelize;
Database.sequelize = connectSQLServer;

// Images
Database.images = ImageModel(connectSQLServer, Sequelize);

// Key_images
Database.key_image = KeyImageModel(connectSQLServer, Sequelize);

Database.key_image.belongsTo(Database.images, {
  through: "key_image",
  foreignKey: "image_id",
});

export = Database;
