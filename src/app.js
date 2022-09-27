// подключение express
import express from "express";
import databaseContext from "./DancePlatform.DA/databaseContext.js";

// создаем объект приложения
const app = express();

// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
     
    // отправляем ответ
    response.send("<h2>Привет Express!</h2>");
});

const placeRouter = express.Router();

placeRouter.use("/place/getAll/:organizerId", (request, response) => {

});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);


(async() => {
    try {
        await databaseContext.testDb();
        console.log('Connected to database');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    await databaseContext.Places.create({studioName: 'DISCIPLINE', address: 'ME'});
    // await sequelize.sync({ force: true });


})().then(x => x);

