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
        unique: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image1: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      image2: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      image3: {
        type: DataTypes.JSON,
        allowNull: true,
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
    Item.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id",
      as: "user",
      onDelete: "SET NULL",
    });
    Item.belongsToMany(models.Category, {
      through: "Category_Item",
      as: "categories",
    });
    Item.belongsToMany(models.User, {
      through: "Favorites",
    });
  };

  return Item;
};
