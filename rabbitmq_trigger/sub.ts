import amqp from "amqplib";
import FormData from "form-data";
import Database from "../src/models";
import { Images } from "../src/types/Image";
import { bindConsumer, getConnectionData } from "../src/config/rabbitmq.config";
import axios from "axios";
import { bucketStorage } from "../src/config/firebase.config";

const DBImages = Database.images;

const consumer = async (message: amqp.ConsumeMessage | null) => {
  if (!message) {
    return;
  }

  const id = message.content.toString();
  const image: Images = await DBImages.findByPk(id);

  const file = bucketStorage.file("Images/" + image.name);
  const [buffer] = await file.download();

  const formData = new FormData();
  formData.append("image", buffer, {
    filename: image.name,
    contentType: "image/png",
  });

  const generateKeyWordByPredictAPI = await axios.post(
    `http://${process.env.IMAGE_CAPTION_GENERATOR_HOST}:${process.env.IMAGE_CAPTION_GENERATOR_PORT}/model/predict`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
      },
    }
  );

  const prediction = generateKeyWordByPredictAPI.data.predictions[0].caption;

  await DBImages.update(
    { prediction: prediction },
    {
      where: {
        id: id,
      },
    }
  );

  return;
};

const main = async () => {
  const { channel } = await getConnectionData();

  bindConsumer(channel, consumer);
};

main();
