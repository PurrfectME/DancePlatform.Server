// подключение express
import express from "express";
import databaseContext from "./DancePlatform.DA/databaseContext.js";
import PlaceService from "./DancePlatform.BL/services/placeService.js";
import RegistrationService from "./DancePlatform.BL/services/registrationService.js";
import WorkshopService from "./DancePlatform.BL/services/workshopService.js";
import ChoreographerService from "./DancePlatform.BL/services/choreographerService.js";
import UserService from "./DancePlatform.BL/services/userService.js";
import ProfileService from "./DancePlatform.BL/services/profileService.js";
import cors from "cors";
import https from "https";
import fs from "fs";

// создаем объект приложения
const app = express();

app.use(cors());
app.use(express.json())

// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
    // отправляем ответ
    response.send("<h2>Привет Express!</h2>");
});

//Ниже описаны все урлы нашего сервера, к которым фронт может обращаться

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
        console.log('HERERER');


        return PlaceService.update(placeToUpdate).then(x => {
            if(x != 0){
                response.send(placeToUpdate);
            }
            else{
                response.sendStatus(400);
            }
        });
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

app.post("/registration/add", (req, res) => {
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

app.get("/registration/getAll", (req, res) => {
    RegistrationService.getAll().then(x => res.send(x));
})

app.post("/registration/delete/:id", (req, res) => {
    RegistrationService.getById(req.params.id).then(itemToDelete => {
        if(itemToDelete == null){
            res.sendStatus(404);
            return;
        }

        RegistrationService.deleteRegistration(itemToDelete).then(x => x);
    })
})

app.get("/registration/get/:id", (req, res) => {
    RegistrationService.getById(req.params.id).then(x => res.send(x));
})

app.put("/registration/update", (req, res) => {
    RegistrationService.update(req.body).then(x => res.send(x));
})

app.get("/registration/:userId", (req, res) => {
    RegistrationService.getUserWorkshops(req.params.userId).then(x => {
        if(x == null){
            res.sendStatus(404);
            return;
        }

        res.send(x);
    })
})

app.post("/registration/checkout-users", (req, res) => {
    for(let i = 0; i < req.body.length; i++){
        RegistrationService.checkoutUsers(req.body[i].userId, req.body[i].workshopId).then(x => x);
    }
})

app.get("/registration/visited/:userId", (req, res) => {
    RegistrationService.getUserVisitedWorkshops(req.params.userId).then(x => res.send(x));
})

app.post("/registration/remove-desired/:userId/:workshopId", (req, res) => {
    RegistrationService.removeFromDesired(req.params.userId, req.params.workshopId).then(x => res.sendStatus(200));
})

// WORKSHOPS

app.post("/workshop/add", (req, res) => {
    //get user by email

    //prepare photo base 64

    const request = req.body;
    console.log(request.photo);
    WorkshopService.create({
        ChoreographerId: request.choreographerId,
        category: request.category,
        style: request.style,
        price: request.price,
        PlaceId: request.placeId,
        date: request.date,
        time: request.time,
        maxUsers: request.maxUsers,
        currentUsersCount: 0,
        isClosed: false,
        minAge: request.minAge,
        createdBy: request.userId,
        comment: "",
        isApprovedByModerator: false,
        photo: request.photo.substring(23),
        photoName: request.photoName,
    }).then(x => {
        let result = x.dataValues;
        result.placeId = result.PlaceId;
        result.choreographerId = result.ChoreographerId;

        res.send(result);
    })
})

app.get("/workshop/getall/:organizerId", (req, res) => {
    WorkshopService.getAll(req.params.organizerId).then(resp => {
        let result = resp.map(x => {
            let workshop = x.dataValues;

            workshop.placeId = workshop.PlaceId;
            workshop.place = workshop.Place;
            workshop.registrations = workshop.Registrations;
            workshop.choreographerId = workshop.ChoreographerId;
            workshop.choreographer = workshop.Choreographer;

            return workshop;
        });

        res.send(result);
    });
})

app.get("/workshop/getAll-users-accounting/:organizerId", (req, res) => {
    WorkshopService.getAllForUsersAccounting(req.params.organizerId).then(x => {
        let result = x.dataValues;
        result.placeId = result.PlaceId;
        result.place = result.Place;
        result.registrations = result.Registrations;
        result.choreographerId = result.ChoreographerId;
        result.choreographer = result.Choreographer;


        res.send(result);
    });
})

app.post("/workshop/delete/:id", (req, res) => {
    WorkshopService.getById(req.params.id).then(x => {
        console.log('AXXX', x)
        if(x == null){
            res.sendStatus(404);
            return;
        }

        WorkshopService.deleteWorkshop(x.dataValues).then(x => res.sendStatus(200));
    })
})

app.get("/workshop/get/:id", (req, res) => {
    WorkshopService.getById(req.params.id).then(x => {
        if(x == null){
            res.sendStatus(404);
            return;
        }

        let result = x.dataValues;
        result.choreographer = result.Choreographer;
        result.choreographerId = result.ChoreographerId;
        result.place = result.Place;
        result.placeId = result.PlaceId;
        result.photo = Buffer.from(result.photo, "base64").toString()

        res.send(result);
    });
})

app.post("/workshop/update", (req, res) => {
    const request = req.body;
    WorkshopService.getById(request.id).then(result => {
        if(result == null){
            res.sendStatus(404);
            return;
        }

        let workshopToUpdate = result.dataValues;

        console.log('WIEOIEWOI', request);

        workshopToUpdate.category = request.category;
        workshopToUpdate.ChoreographerId = request.choreographerId;
        workshopToUpdate.style = request.style;
        workshopToUpdate.price = request.price;
        workshopToUpdate.date = request.date;
        workshopToUpdate.time = request.time;
        workshopToUpdate.PlaceId = request.placeId;
        workshopToUpdate.minAge = request.minAge;
        workshopToUpdate.maxUsers = request.maxUsers;
        workshopToUpdate.isClosed = request.isClosed;
        workshopToUpdate.photoName = request.photoName;
        workshopToUpdate.photo = new TextEncoder().encode(request.photo);

        WorkshopService.update(workshopToUpdate).then(x => {
            workshopToUpdate.placeId = workshopToUpdate.PlaceId;
            workshopToUpdate.choreographerId = workshopToUpdate.ChoreographerId;

            res.send(workshopToUpdate);
        });
    })
})

app.get("/workshop/registered-users/:workshopId", (req, res) => {
    WorkshopService.getWorkshopUsers(req.params.workshopId).then(x => res.send(x));
})

app.get("/workshop/available/:userId", (req, res) => {
    UserService.findById(req.params.userId).then(user => {
        WorkshopService.getAvailableWorkshopsForUser(req.params.userId, user.dataValues.dateOfBirth).then(resp => {
            let result = resp.map(x => {
                let workshop = x.dataValues;
    
                workshop.photo = Buffer.from(workshop.photo, "base64").toString();
                workshop.placeId = workshop.PlaceId;
                workshop.place = workshop.Place;
                workshop.registrations = workshop.Registrations;
                workshop.choreographerId = workshop.ChoreographerId;
                workshop.choreographer = workshop.Choreographer;
    
                return workshop;
            });

            res.send(result);
        });
    });
})

app.get("/workshop/awaiting-approval", (req, res) => {
    WorkshopService.getWorkshopsForApproval().then(resp => {
        let result = resp.map(x => {
            let workshop = x.dataValues;

            workshop.photo = Buffer.from(workshop.photo, "base64").toString();
            workshop.placeId = workshop.PlaceId;
            workshop.place = workshop.Place;
            workshop.registrations = workshop.Registrations;
            workshop.choreographerId = workshop.ChoreographerId;
            workshop.choreographer = workshop.Choreographer;

            return workshop;
        });


        res.send(result)
    });
})

app.get("/workshop/workshops-history/:organizerId", (req, res) => {
    WorkshopService.getClosed(req.params.organizerId).then(x => res.send(x));
})

app.get("/workshop/desired/:userId", (req, res) => {
    WorkshopService.getUserDesiredWorkshops(req.params.userId).then(x => {
        if(x == null){
            res.sendStatus(404);
            return;
        }

        res.send(x);
    })
})


app.post("/workshop/approve/:workshopId", (req, res) => {
    WorkshopService.approveWorkshop(req.params.workshopId).then(x => res.sendStatus(200));
})

app.post("/workshop/decline/:workshopId/:comment", (req, res) => {
    WorkshopService.declineWorkshop(req.params.workshopId, req.params.comment).then(x => res.sendStatus(200));
})


// CHOREOGRAPHERS
app.post("/choreographer/add", (req, res) => {
    ChoreographerService.create(req.body).then(x => res.send(x));
})

app.get("/choreographer/getall/:organizerId", (req, res) => {
    ChoreographerService.getAll(req.params.organizerId).then(x => res.send(x));
})

app.post("/choreographer/delete/:id", (req, res) => {
    ChoreographerService.getById(req.params.id).then(x => {
        if(x == null){
            res.sendStatus(404);
            return;
        }

        ChoreographerService.deleteChoreographer(x).then(x => res.sendStatus(200));
    })
})

app.post("/choreographer/update", (req, res) => {
    const request = req.body;

    ChoreographerService.getById(request.id).then(result => {
        if(result == null){
            res.sendStatus(400);
            return;
        }

        let choreoToUpdate = result.dataValues;

        choreoToUpdate.dateOfBirth = request.dateOfBirth;
        choreoToUpdate.description = request.description;
        choreoToUpdate.link = request.link;
        choreoToUpdate.name = request.name;
        choreoToUpdate.style = request.style;
        // console.log('asd',choreoToUpdate);
        ChoreographerService.update(choreoToUpdate).then(x => res.send(choreoToUpdate));
    })
})


// USERS
app.post("/auth/register", (req, res) => {
    UserService.register(req.body).then(result => {
        if(result.Status == "Error"){
            res.status(400).send({
                message: result.Message
            });
            return;
        }

        res.send(result);
    })
})

app.post("/auth/login", (req, res) => {
    // console.log(req.body)
    UserService.login(req.body).then(result => {
        console.log(result);
        // if(result.Status == "Unauthorized"){
        //     res.sendStatus(401);
        //     return;
        // }

        res.send(result);
    }).catch(err => {
        console.log(err);
        res.status(401).send({message: err.Status})
    })
})


// PROFILE
app.get("/user/registrations/:userId", (req, res) => {
    RegistrationService.getUserRegistrations(req.params.userId).then(regs => {
        if(regs == null){
            res.sendStatus(400);
            return;
        }

        res.send(regs);
    })
});

app.post("/user/upload-image/:userId", (req, res) => {
    req.body.base64Img = req.body.base64Img.substring(0, 23);
    const converted = Uint8Array.from(atob(req.body.base64Img), c => c.charCodeAt(0));

    ProfileService.uploadImage(converted).then(x => res.sendStatus(200));
});

app.get("/user/get-photo/:id", (req, res) => {
    ProfileService.getUserPhoto(req.params.id).then(photo => {
        if(photo == null){
            res.sendStatus(400);
            return;
        }

        res.send(Uint8Array.from(atob(photo), c => c.charCodeAt(0)));        
    })
})

app.post("/user/delete-photo/:id", (req, res) => {
    ProfileService.deleteUserPhoto(req.params.id).then(x => res.sendStatus(200));
})

app.post("/user/update-user", (req, res) => {
    const request = req.body;
    UserService.findById(request.id).then(userToUpdate => {
        userToUpdate.surname = request.surname;
        userToUpdate.phoneNumber = request.phoneNumber;
        userToUpdate.name = request.name;
        userToUpdate.dateOfBirth = request.dateOfBirth;

        UserService.update(userToUpdate).then(x => res.send(x));
    })
})


var privateKey = fs.readFileSync('../security/selfsigned.key');
var certificate = fs.readFileSync('../security/selfsigned.crt');
https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(8443);


const seedModerator = async() => {
    if(await UserService.findByRole("Moderator")) return;

    const moderator = {
        username: "Moderator",
        email: "moderator@gmail.com",
        role: "Moderator",
        passwordHash: UserService.generateHash("moderator"),
    }

    await UserService.createUser(moderator);
}

(async() => {
    try {
        await databaseContext.testDb();
        console.log('Connected to database');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }


    // await databaseContext.updateDatabase(true);
    await seedModerator();

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