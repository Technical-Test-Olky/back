export const ImageModel = (sequelize: any, Sequelize: any) => {
  return sequelize.define(
    "images",
    {
      name: {
        type: Sequelize.STRING,
      },
      selfLink: {
        type: Sequelize.STRING,
      },
      mediaLink: {
        type: Sequelize.STRING,
      },
      prediction: {
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );
};
