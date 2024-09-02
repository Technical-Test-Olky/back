import { FindAll, Search, Post } from "../controllers/image.controller";

const ImageRoute = (app: any) => {
  app.get("/images", FindAll);
  app.get("/images/search", Search);

  app.post("/upload", Post);
};

export default ImageRoute;
