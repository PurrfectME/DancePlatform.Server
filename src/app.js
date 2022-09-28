// подключение express
import express from "express";
import Style from "./DancePlatform.BL/models/style.js";
import Category from "./DancePlatform.BL/models/category.js";
import databaseContext from "./DancePlatform.DA/databaseContext.js";
import PlaceService from "./DancePlatform.BL/services/placeService.js";

// создаем объект приложения
const app = express();

// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
     
    // отправляем ответ
    response.send("<h2>Привет Express!</h2>");
});

const placeRouter = express.Router();

// PLACES
app.get("/place/getAll/:organizerId", (request, response) => {
    PlaceService.getAll(request.params.organizerId).then(x => {response.send(x)});
});

app.get("/place/get/:id", (request, response) => {
    PlaceService.getById(request.params.id).then(x => {response.send(x)});
});

app.post("/place/add", (request, response) => {
    PlaceService.create(request.body).then(x => {response.send(x)});
});

app.post("/place/update", (request, response) => {
    PlaceService.getById(request.body.id).then(placeToUpdate => {
        if(placeToUpdate == null){
            response.sendStatus(404);
            return;
        }

        placeToUpdate.studioName = request.body.studioName;
        placeToUpdate.address = request.body.address;

        PlaceService.update(placeToUpdate).then(x => {response.send(x)});
    });
});

app.post("/place/delete/:id", (request, response) => {
    PlaceService.getById(request.params.id).then(placeToDelete => {
        if(placeToDelete == null){
            response.sendStatus(404);
            return;
        }

        PlaceService.deletePlace(placeToDelete).then(x => {response.send(x)});
    });
});

//REGISTRATIONS

app.post("registration/add", (req, res) => {
    
})



// начинаем прослушивать подключения на 3000 порту
app.listen(3000);


(async() => {
    try {
        await databaseContext.testDb();
        console.log('Connected to database');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    // await databaseContext.updateDatabase(true);

    // await databaseContext.Choreographers.create({
    //     name: "Lilya",
    //     dateOfBirth: new Date(),
    //     description: "COOL",
    //     link: "link",
    //     style: Style.Afro,
    //     createdBy: 1,
    // })

    // await databaseContext.Workshops.create({
    //     style: Style.JazzFunk,
    //     category: Category.Pro,
    //     date: new Date(),
    //     time: new Date().getHours(),
    //     photo: [0,1,0,1,1,0],
    //     photoName: 'name',
    //     price: 100.1,
    //     minAge: 17,
    //     maxUsers: 10,
    //     currentUsersCount: 1,
    //     isApprovedByModerator: false,
    //     isClosed: false,
    //     comment: "GGOGOGOGOGO",
    //     createdBy: 1,
    //     PlaceId: 1,
    //     ChoreographerId: 1,
    // });

})().then(x => x);