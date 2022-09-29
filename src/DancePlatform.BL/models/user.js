import { DataTypes } from 'sequelize'; 

const User = {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    photo: {
        type: DataTypes.BLOB("long"),
        allowNull: true,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true
    }
};

export default User;