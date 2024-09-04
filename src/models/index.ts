require("dotenv").config();
import { Sequelize } from "sequelize";
import { ImageModel } from "./image.model";
import { connectSQLServer } from "../config/sequelize.config";

const Database: any = {};

// Build database
Database.Sequelize = Sequelize;
Database.sequelize = connectSQLServer;

// Images
Database.images = ImageModel(connectSQLServer, Sequelize);

export = Database;
