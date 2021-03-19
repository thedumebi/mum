module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    "Item",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: DataTypes.INTEGER,
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "upload/photos/d-avatar.jpg",
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
      sequelize,
      tableName: "Item",
    }
  );

  Item.associate = function (models) {
    Item.belongsTo(models.User, { foreignKey: "userId", targetKey: "id" });
  };

  return Item;
};
