import Express from "express";
import axios from "axios";
import path from "path";
import fs from "fs";
import FormData from "form-data";
import Database from "../models";
import { storage } from "../config/firebase.config";

const Images = Database.images;
const Op = Database.Sequelize.Op;

export const FindAll = (req: Express.Request, res: Express.Response) => {
  const { id } = req.params;
  Images.findAll()
    .then(async (data: any) => {
      res.send(data);
    })
    .catch((error: TypeError) => {
      res.status(500).send({
        message: error.message || "Error retrieving basket with id=" + id,
      });
    });
};

export const Search = (req: Express.Request, res: Express.Response) => {
  const { q } = req.query;
  const condition = q ? { name: { [Op.like]: `%${q}%` } } : null;

  Images.findAll({ where: condition })
    .then(async (data: any) => {
      res.send(data);
    })
    .catch((error: TypeError) => {
      res.status(500).send({
        message: error.message || "Error retrieving images",
      });
    });
};

export const Post = async (req: Express.Request, res: Express.Response) => {
  let sampleFile;

  // Vérifie si des fichiers ont été uploadés
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  sampleFile = req.files.sampleFile as any;

  // Assurez-vous que le fichier est bien présent
  if (!sampleFile || !sampleFile.name) {
    return res.status(400).send("File is missing.");
  }

  // Définir le nom et le chemin du fichier
  const pdfFile = `PDF/${sampleFile.name}`;
  const filePath = path.join(__dirname, "..", "temp", sampleFile.name);

  // Déplacez le fichier téléchargé vers le répertoire temporaire
  sampleFile.mv(filePath, async (err: any) => {
    if (err) {
      console.error("Error moving file:", err);
      return res.status(500).send("Error moving file.");
    }

    try {
      // Téléversement du fichier sur le stockage Firebase
      const firebaseUpload: any = await storage.upload(filePath, {
        destination: pdfFile,
        gzip: true,
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });

      // Effectuez une demande HTTP à http://localhost:5000/model/predict
      const formData = new FormData();
      formData.append("image", fs.createReadStream(filePath)); // Utilisez fs.createReadStream pour envoyer le fichier correctement

      const response = await axios.post(
        "http://localhost:5000/model/predict",
        formData,
        {
          headers: {
            ...formData.getHeaders(), // Ajoutez les bons headers multipart
          },
        }
      );

      // Réponse en cas de succès
      if (res.status(200)) {
        const result = Images.create({
          name: sampleFile.name,
          mediaLink: firebaseUpload[0].metadata.mediaLink,
          selfLink: firebaseUpload[0].metadata.selfLink,
          prediction: response.data.predictions[0].caption,
        });
        return res.status(200).send(...result);
      }
    } catch (error) {
      console.error("Error uploading file or predicting:", error);
      return res.status(500).send("Error uploading file or predicting.");
    } finally {
      // Nettoyer le fichier temporaire
      return fs.unlink(filePath, (err: any) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    }
  });

  return;
};
