require("dotenv").config();
import { Sequelize } from "sequelize";
import { ImageModel } from "./image.model";

//Connect to SQL database
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
const sequelize = new Sequelize(
  DB_NAME as string,
  DB_USER as string,
  DB_PASSWORD as string,
  {
    host: DB_HOST as string,
    port: DB_PORT as unknown as number,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const Database: any = {};

// Build database
Database.Sequelize = Sequelize;
Database.sequelize = sequelize;

// Images
Database.images = ImageModel(sequelize, Sequelize);

export = Database;
