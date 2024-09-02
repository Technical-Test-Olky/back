import Express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import ImageRoute from "./routes/image.routes";
import Database from "./models";

// Constant
let PORT = "8080";

const app: Express.Application = Express();

app.use(cors());
app.use(fileUpload());
app.use(Express.urlencoded({ limit: "50mb", extended: true }));
app.use(Express.json({ limit: "50mb" }));

// Sequelize
Database.sequelize.sync();

// Imports Routes
ImageRoute(app);

//Define Project API
app.get("/", (_req: Express.Request, res: Express.Response) => {
  res.json({ message: "Welcome to Olky test application." });
});

app.listen(PORT, () => {
  console.log(`Server run to PORT ${PORT}`);
});
