module.exports = (sequelize, DataTypes) => {
  const FAQs = sequelize.define(
    "FAQs",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      question: {
        type: DataTypes.STRING,
      },
      answer: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "FAQs",
    }
  );

  return FAQs;
};
