const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      fullName: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue("password", bcrypt.hashSync(value, 10));
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM,
        values: ["customer", "admin"],
        defaultValue: "customer",
      },
      profileImage: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
          url:
            "https://ik.imagekit.io/msf9dwhbk3m/AC26972E-41EB-4318-877F-1ACBB7B32AC0_IMrRiKVMPG-t.jpeg",
        },
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
      sequelize,
      tableName: "User",
      hooks: {
        beforeSave: (user, options) => {
          user.fullName = [user.firstName, user.lastName].join(" ");
        },
        beforeUpdate: (user, options) => {
          user.fullName = [user.firstName, user.lastName].join(" ");
        },
      },
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Item, { foreignKey: "userId", as: "items" });
    User.belongsToMany(models.Item, { through: "Favorites", as: "favorites" });
  };

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.prototype.getFullName = function () {
    return [this.firstName, this.lastName].join(" ");
  };

  return User;
};
