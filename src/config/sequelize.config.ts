require("dotenv").config();
import { Sequelize } from "sequelize";
import { checkEnvVars } from "../utils/checkEnvVars";

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const requiredEnvVars = [
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
];

checkEnvVars(requiredEnvVars);

export const connectSQLServer = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT!, 10),
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

try {
  connectSQLServer.authenticate();
  console.log("⚡️[database]: Connexion à la base de données réussie !");
} catch (error) {
  console.error("Impossible de se connecter à la base de données :", error);
}
