import databaseContext from "../../DancePlatform.DA/databaseContext.js";
import { Op } from 'sequelize';

const postRegistration = (registration) =>
    databaseContext.Registrations.create(registration);

const deleteRegistration = (registration) =>
    databaseContext.Registrations.destroy(registration);

const getAll = () =>
    databaseContext.Registrations.findAll();

const getById = (id) =>
    databaseContext.Registrations.findByPk(id);

const getUserRegistrations = (userId) => {
    const result = databaseContext.Registrations.findAll({
        include: databaseContext.Users,
        where: {
            UserId: {
                [Op.eq]: userId, 
            },
            isPaid: true
        }
    });

    return result.then(x => x.length == 0 ? null : x);
}

const getUserWorkshops = (userId) => {
    const result = databaseContext.Registrations.findAll({
        include: [
            {
                model: databaseContext.Workshops, include: [databaseContext.Places, databaseContext.Choreographers]
            },
            {
                model: databaseContext.Users
            }
        ],
        where: {
            UserId: userId,
            isPresent: false,
            isDesired: false
        }
    });

    return result.then(x => x.length == 0 ? null : x.filter(item => item.Workshop.isClosed == false));
}

const checkoutUsers = (userId, workshopId) => {
    let registration = databaseContext.Registrations.findOne({
        where: {
            UserId: userId,
            WorkshopId: workshopId
        }
    });

    return registration.then(x => {
        x.isPresent = true;

        return update(x);
    })
}

const update = (registration) =>
    databaseContext.Registrations.update(registration);

const getByUserAndWorkshopIds = (userId, workshopId) =>
    databaseContext.Registrations.findOne({
        where: {
            UserId: userId,
            WorkshopId: workshopId
        }
    });

const getUserVisitedWorkshops = (userId) => {
    const result = databaseContext.Registrations.findAll({
        include: [
            {
                model: databaseContext.Workshops, include: [databaseContext.Places, databaseContext.Choreographers]
            },
        ],
        where: {
            UserId: userId,
            isPresent: true,

        }
    });

    return result.then(x => x.Workshop.filter(item => item.isClosed == true));
}

const removeFromDesired = (userId, workshopId) => {
    const registration = getByUserAndWorkshopIds(userId, workshopId);

    return registration.then(x => deleteRegistration(x).then(y => y));    
}

const RegistrationService = {
    postRegistration,
    deleteRegistration,
    getAll,
    getById,
    getUserRegistrations,
    getUserWorkshops,
    checkoutUsers,
    update,
    getByUserAndWorkshopIds,
    getUserVisitedWorkshops,
    removeFromDesired
};

export default RegistrationService;