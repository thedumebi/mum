module.exports = (sequelize, DataTypes) => {
  const Sales = sequelize.define(
    "Sales",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: "Sales",
    }
  );

  Sales.associate = function (models) {
    Sales.belongsTo(models.Item, {
      foreignKey: "itemId",
      targetKey: "id",
      as: "item",
      onDelete: "SET NULL",
    });
  };

  return Sales;
};
