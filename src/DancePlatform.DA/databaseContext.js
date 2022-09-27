import Place from "../DancePlatform.BL/models/place.js";
import {Sequelize, DataTypes} from "sequelize";

const sequelize = new Sequelize('dance', 'root', 'кщще', {
    host: 'localhost',
    dialect: 'mysql'
});

//определяем таблицы для БД
const Places = sequelize.define('Place', Place);


const testDb = async () => await sequelize.authenticate();


const databaseContext = {
    Places,


    testDb
};

export default databaseContext;