import Express from "express";
import { Search, Post, FindPaginate } from "../controllers/image.controller";

const ImageRoute = (app: Express.Application) => {
  app.get("/images", FindPaginate);
  app.get("/images/search", Search);

  app.post("/images/upload", Post);
};

export default ImageRoute;
