// подключение express
import express from "express";
import Style from "./DancePlatform.BL/models/style.js";
import Category from "./DancePlatform.BL/models/category.js";
import databaseContext from "./DancePlatform.DA/databaseContext.js";
import PlaceService from "./DancePlatform.BL/services/placeService.js";
import RegistrationService from "./DancePlatform.BL/services/registrationService.js";
import WorkshopService from "./DancePlatform.BL/services/workshopService.js";

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
    const registration = req.body;

    RegistrationService.getByUserAndWorkshopIds(registration.userId, registration.workshopId).then(existingRegistration => {
        WorkshopService.getById(registration.workshopId).then(workshopToUpdate => {
            if (existingRegistration == null && registration.isPaid)
            {
                RegistrationService.postRegistration({
                    UserId: registration.userId,
                    WorkshopId: registration.workshopId,
                    isPaid: registration.isPaid,
                    isDesired: false
                }).then(x => {
                    workshopToUpdate.currentUsersCount++;
                    WorkshopService.update(workshopToUpdate).then(x => x);
                })
			}
            else if(registration.isDesired){
                RegistrationService.postRegistration({
                    UserId: registration.UserId,
                    WorkshopId: registration.WorkshopId,
                    isPaid: false,
                    isDesired: registration.IsDesired,
                }).then(x => x);
            }
            else{
                existingRegistration.isPaid = true;
                existingRegistration.isDesired = false;
                RegistrationService.update(existingRegistration).then(x => x);

                workshopToUpdate.currentUsersCount++;
                WorkshopService.update(workshopToUpdate).then(x => x);
            }
        })
    });
})

app.get("registration/getAll", (req, res) => {
    RegistrationService.getAll().then(x => res.send(x));
})

app.post("registration/delete/:id", (req, res) => {
    RegistrationService.getById(req.params.id).then(itemToDelete => {
        if(itemToDelete == null){
            res.sendStatus(404);
            return;
        }

        RegistrationService.deleteRegistration(itemToDelete).then(x => x);
    })
})

app.get("registration/get/:id", (req, res) => {
    RegistrationService.getById(req.params.id).then(x => res.send(x));
})

app.put("registration/update", (req, res) => {
    RegistrationService.update(req.body).then(x => res.send(x));
})

app.get("registration/:userId", (req, res) => {
    RegistrationService.getUserWorkshops(req.params.userId).then(x => {
        if(x == null){
            res.sendStatus(404);
            return;
        }

        res.send(x);
    })
})

app.post("registration/checkout-users", (req, res) => {
    for(let i = 0; i < req.body.length; i++){
        RegistrationService.checkoutUsers(req.body[i].userId, req.body[i].workshopId).then(x => x);
    }
})

app.get("registration/visited/:userId", (req, res) => {
    RegistrationService.getUserVisitedWorkshops(req.params.userId).then(x => res.send(x));
})

app.post("registration/remove-desired/:userId/:workshopId", (req, res) => {
    RegistrationService.removeFromDesired(req.params.userId, req.params.workshopId).then(x => res.sendStatus(200));
})

// WORKSHOPS

app.post("workshop/add", (req, res) => {
    //get user by email

    //prepare photo base 64

    const request = req.body;
    WorkshopService.create({
        ChoreographerId: request.choreographerId,
        category: request.category,
        style: request.ctyle,
        price: request.price,
        PlaceId: request.placeId,
        date: request.date,
        time: request.time,
        maxUsers: request.maxUsers,
        minAge: request.minAge,
        // createdBy: user.Id,
        isApprovedByModerator: false,
        photo: Uint8Array.from(atob(request.photo.substring(0, 23)), c => c.charCodeAt(0)),
        photoName: request.photoName
    }).then(x => res.send(x))
})

app.get("workshop/getall/:organizerId", (req, res) => {
    WorkshopService.getAll(req.params.organizerId).then(x => res.send(x));
})

app.get("workshop/getAll-users-accounting/:organizerId", (req, res) => {
    WorkshopService.getAllForUsersAccounting(req.params.organizerId).then(x => res.send(x));
})

app.post("workshop/delete/:id", (req, res) => {
    WorkshopService.getById(req.params.id).then(x => {
        if(x == null){
            res.sendStatus(404);
            return;
        }

        WorkshopService.deleteWorkshop(x).then(x => x);
    })
})

app.get("workshop/get/:id", (req, res) => {
    WorkshopService.getById(req.params.id).then(x => {
        if(x == null){
            res.sendStatus(404);
            return;
        }

        res.send(x);
    });
})

app.post("workshop/update", (req, res) => {
    const request = req.body;
    WorkshopService.getById(request.id).then(workshopToUpdate => {
        if(workshopToUpdate == null){
            res.sendStatus(404);
            return;
        }

        workshopToUpdate.category = request.category;
        workshopToUpdate.ChoreographerId = request.choreographerId;
        workshopToUpdate.style = request.style;
        workshopToUpdate.price = request.price;
        workshopToUpdate.date = request.date.ToString();
        workshopToUpdate.time = request.Time.ToString();
        workshopToUpdate.PlaceId = request.placeId;
        workshopToUpdate.minAge = request.minAge;
        workshopToUpdate.maxUsers = request.maxUsers;
        workshopToUpdate.isClosed = request.isClosed;
        workshopToUpdate.photoName = request.photoName;
        workshopToUpdate.photo = request.photo.includes("data") ? Uint8Array.from(atob(request.photo.substring(0, 23)), c => c.charCodeAt(0))
         : Uint8Array.from(atob(request.photo), c => c.charCodeAt(0));

        WorkshopService.update(workshopToUpdate).then(x => res.send(x));
    })
})

app.get("workshop/registered-users/:workshopId", (req, res) => {
    WorkshopService.getWorkshopUsers(req.params.workshopId).then(x => res.send(x));
})

app.get("workshop/available/:userId", (req, res) => {
    WorkshopService.getAvailableWorkshopsForUser(req.params.userId, null).then(x => res.send(x));
    // var user = await _userManager.FindByIdAsync(userId.ToString());
    //         List<Workshop> result;

    //         if(await _userManager.IsInRoleAsync(user, "User"))
    //         {
    //             result = await _service.GetAvailableWorkshopsForUser(userId, user.DateOfBirth);
    //         }
    //         else
    //         {
    //             result = await _service.GetAvailableWorkshopsForUser(userId, null);
    //         }

    //         return Ok(result);
})

app.get("workshop/awaiting-approval", (req, res) => {
    WorkshopService.getWorkshopsForApproval().then(x => res.send(x));
})

app.get("workshop/workshops-history/:organizerId", (req, res) => {
    WorkshopService.getClosed(req.params.organizerId).then(x => res.send(x));
})

app.get("workshop/desired/:userId", (req, res) => {
    WorkshopService.getUserDesiredWorkshops(req.params.userId).then(x => {
        if(x == null){
            res.sendStatus(404);
            return;
        }

        res.send(x);
    })
})


app.post("workshop/approve/:workshopId", (req, res) => {
    WorkshopService.approveWorkshop(req.params.workshopId).then(x => res.sendStatus(200));
})

app.post("workshop/decline/:workshopId/:comment", (req, res) => {
    WorkshopService.declineWorkshop(req.params.workshopId, req.params.comment).then(x => res.sendStatus(200));
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