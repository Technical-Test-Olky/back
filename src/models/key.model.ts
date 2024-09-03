export const KeyImageModel = (sequelize: any, Sequelize: any) => {
  return sequelize.define(
    "key_images",
    {
      image_id: {
        type: Sequelize.INTEGER,
      },
      image_key: {
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );
};
