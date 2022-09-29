import { DataTypes } from 'sequelize'; 

const Workshop = {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    style: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
    },
    photoName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    minAge: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maxUsers: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentUsersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isApprovedByModerator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isClosed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
};


export default Workshop;