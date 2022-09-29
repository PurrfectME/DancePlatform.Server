import Place from "../DancePlatform.BL/models/place.js";
import {Sequelize, DataTypes} from "sequelize";
import Workshop from "../DancePlatform.BL/models/workshop.js";
import Choreographer from "../DancePlatform.BL/models/choreographer.js";
import Registration from "../DancePlatform.BL/models/registration.js";
import User from "../DancePlatform.BL/models/user.js";

const sequelize = new Sequelize('dance', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

//определяем таблицы для БД
const Places = sequelize.define('Place', Place);
const Workshops = sequelize.define('Workshops', Workshop);
const Choreographers = sequelize.define('Choreographers', Choreographer);
const Registrations = sequelize.define('Registrations', Registration);
const Users = sequelize.define('Users', User);

//определяем связи между таблицами
Places.hasMany(Workshops);
Workshops.belongsTo(Places);

Choreographers.hasMany(Workshops);
Workshops.belongsTo(Choreographers);

Workshops.hasMany(Registrations);
Registrations.belongsTo(Workshops);

Users.hasMany(Registrations);
Registrations.belongsTo(Users);

const testDb = async () => await sequelize.authenticate();
const updateDatabase = async (force) => await sequelize.sync({force: force});

const databaseContext = {
    Places,
    Workshops,
    Choreographers,
    Registrations,
    Users,
    updateDatabase,
    testDb
};

export default databaseContext;