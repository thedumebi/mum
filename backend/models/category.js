module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
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
      description: {
        type: DataTypes.STRING,
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
      tableName: "Category",
    }
  );

  Category.associate = function (models) {
    Category.belongsToMany(models.Item, {
      through: "Category_Item",
      as: "items",
    });
  };

  return Category;
};
