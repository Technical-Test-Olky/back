import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import Database from "../models";
import { bucketStorage } from "../config/firebase.config";
import { getPagination, getPagingData } from "../utils/pagination";
import type Express from "express";
import type fileUpload from "express-fileupload";
import type { Images } from "../types/Image";
import { stringToArray } from "../utils/transform";

const Images = Database.images;
const KeyImages = Database.key_images;
const Op = Database.Sequelize.Op;

export const FindPaginate = async (
  req: Express.Request,
  res: Express.Response
) => {
  const { page, size, id } = req.query;
  const { limit, offset } = getPagination(page, size);

  // Find all images
  const findAndCountAll: Images[] = await Images.findAndCountAll({
    where: id ? { id: { [Op.like]: `%${id}%` } } : null,
    limit,
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
  const findKeyByQueryValue = await KeyImages.findAll({
    where: key ? { image_key: { [Op.like]: `%${key}%` } } : null,
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
    const valueByPrimaryKey = await Images.findByPk(item.id_image);
    result.push(valueByPrimaryKey);
  }
  return res.status(200).send(result);
};

export const Post = async (req: Express.Request, res: Express.Response) => {
  // Vérifiez si le fichier existe
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const dataFile = req.files.dataFile as fileUpload.UploadedFile;
  const pdfFile = `PDF/${dataFile.name}`;
  const filePath = path.join(__dirname, "..", "temp", dataFile.name);

  console.log(filePath);
  // Effectuez le déplacement d'un fichier dans le serveur
  await dataFile.mv(filePath);

  console.log(fs.createReadStream(filePath));
  // Effectuez une demande HTTP à http://localhost:5000/model/predict générer les keywords
  const formData = new FormData();
  formData.append("image", fs.createReadStream(filePath));

  const generateKeyWordByPredictAPI = await axios.post(
    "http://localhost:5000/model/predict",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
      },
    }
  );

  // Réponse en cas d'erreur
  if (generateKeyWordByPredictAPI.status !== 200) {
    return res.status(500).send("Error generating keywords.");
  }

  // Upload file to Firebase
  const firebaseUpload = await bucketStorage.upload(filePath, {
    destination: pdfFile,
    gzip: true,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  if (!firebaseUpload) {
    return res.status(500).send("Error uploading file to Firebase.");
  }

  // Ajouter les données dans la base de données
  const prediction = generateKeyWordByPredictAPI.data.predictions[0].caption;

  // Table Images
  const dataImage = await Images.create({
    name: dataFile.name,
    mediaLink: firebaseUpload[0].metadata.mediaLink,
    selfLink: firebaseUpload[0].metadata.selfLink,
    prediction: prediction,
  });

  // Generate key for picture
  const arrayKey = stringToArray(prediction);
  if (!arrayKey) {
    return res.status(500).send("Error generating keywords.");
  }

  const tableKey = arrayKey.map((item: string) => {
    KeyImages.create({
      id_image: dataImage.id,
      key: item,
    });
  });

  if (!tableKey) {
    return res.status(500).send("Error generating keywords");
  }

  return res.status(200).send(dataImage);
};
