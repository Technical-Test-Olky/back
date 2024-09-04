require("dotenv").config();
import path from "path";
import Database from "../models";
import { getPagination, getPagingData } from "../utils/pagination";
import type Express from "express";
import type fileUpload from "express-fileupload";
import type { Images } from "../types/Image";
import { bucketStorage } from "../config/firebase.config";
import {
  disconnect,
  getConnectionData,
  publishMessage,
} from "../config/rabbitmq.config";

const DBImages = Database.images;
const Op = Database.Sequelize.Op;

export const FindPaginate = async (
  req: Express.Request,
  res: Express.Response
) => {
  const { page, size, id } = req.query;
  const { limit, offset } = getPagination(page, size);

  // Find all images
  const findAndCountAll: Images[] = await DBImages.findAndCountAll({
    where: id ? { id: { [Op.like]: `%${id}%` } } : null,
    limit: limit === 0 ? 10 : limit,
    offset,
    attributes: ["id", "name", "selfLink", "mediaLink", "prediction"],
  }).catch((err: TypeError) => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials.",
    });
  });

  // Return 404 if the images are not found
  if (!findAndCountAll) {
    res.status(404).send({ message: "Images not found" });
  }

  // Return the images with pagination
  const response = getPagingData(findAndCountAll, page, limit);
  res.status(200).send(response);
};

export const Search = async (req: Express.Request, res: Express.Response) => {
  const { key } = req.query;

  // Find the key by query value
  const findKeyByQueryValue = await DBImages.findAll({
    where: key ? { prediction: { [Op.like]: `%${key}%` } } : null,
  }).catch((error: TypeError) => {
    res.status(500).send({
      message: error.message || "Error retrieving images",
    });
  });

  // Return 404 if the key is not found
  if (!findKeyByQueryValue) {
    res.status(404).send({ message: "Key not found" });
  }

  // Get the value of the primary key
  let result = [];
  for (let item of findKeyByQueryValue) {
    const valueByPrimaryKey = await DBImages.findByPk(item.id);
    result.push(valueByPrimaryKey);
  }
  return res.status(200).send(result);
};

export const Post = async (req: Express.Request, res: Express.Response) => {
  const { connection, channel } = await getConnectionData();

  // Vérifiez si le fichier existe
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const dataFile = req.files.dataFile as fileUpload.UploadedFile;
  const imageFile = `Images/${dataFile.name}`;
  const filePath = path.join(__dirname, "..", "temp", dataFile.name);

  await dataFile.mv(filePath);

  // Upload file to Firebase
  const firebaseUpload = await bucketStorage.upload(filePath, {
    destination: imageFile,
    gzip: true,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  if (!firebaseUpload) {
    return res.status(500).send("Error uploading file to Firebase.");
  }

  // Create a new image
  const uploadPicture = await DBImages.create({
    name: dataFile.name,
    mediaLink: firebaseUpload[0].metadata.mediaLink,
    selfLink: firebaseUpload[0].metadata.selfLink,
  });

  publishMessage(channel, uploadPicture.id.toString());

  await disconnect(connection, channel);

  return res.status(200).send(uploadPicture);
};
