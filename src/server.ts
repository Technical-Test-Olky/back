import Express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import ImageRoute from "./routes/image.routes";
import Database from "./models";

// Constant
let PORT = "8083";

const app: Express.Application = Express();

app.use(cors());
app.use(fileUpload());
app.use(Express.urlencoded({ limit: "50mb", extended: true }));
app.use(Express.json({ limit: "50mb" }));

// Use Sequelize to sync the database
Database.sequelize.sync(true);

// Imports Routes
ImageRoute(app);

app.get("/", (req: Express.Request, res: Express.Response) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
