import { DataTypes } from 'sequelize'; 

const Registration = {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    isPresent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isDesired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
};

export default Registration;