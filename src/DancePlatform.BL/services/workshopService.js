import databaseContext from "../../DancePlatform.DA/databaseContext.js";
import { Op } from 'sequelize';

const create = (workshop) =>
    databaseContext.Workshops.create(workshop);

const deleteWorkshop = workshop =>
    databaseContext.Workshops.destroy(workshop);

const getAll = (organizerId) =>
    databaseContext.Workshops.findAll({
        include: [
            databaseContext.Places,
            databaseContext.Choreographers,
            databaseContext.Registrations
        ],
        where: {
            isClosed: false,
            createdBy: organizerId
        }
    });

const getWorkshopUsers = workshopId =>
    databaseContext.Workshops.findOne({
        include: [
            {model: databaseContext.Registrations, include: [databaseContext.Users]}
        ],
        where: {
            id: workshopId
        }
    }).then(workshop => workshop.Registrations.map(x => x.User));

const getById = (id) =>
    databaseContext.Workshops.findAll({
        include: [databaseContext.Choreographers, databaseContext.Places],
        where: {
            id: id
        }
    }).then(x => x[0]);

const getAvailableWorkshopsForUser = (userId, dateOfBirth = null) => {
    const currentYear = new Date().getFullYear();
    const userAge = dateOfBirth != null ? currentYear - dateOfBirth.getFullYear() : -1;
    
    const workshops = databaseContext.Workshops.findAll({
        include: [databaseContext.Choreographers, databaseContext.Registrations, databaseContext.Places],
        where: {
            isClosed: false,
            isApprovedByModerator: true,
        }
    }).then(x => x.filter(i => i.currentUsersCount < i.maxUsers && i.minAge <= userAge));

    var result = [];

    workshops.then(x => x.forEach(item => {
        if(item.Registrations.length == 0){
            result.push(item);
        }
        else{
            if(!item.Registrations.includes(x => x.UserId == userId)){
                result.push(item);
            }
        }
    }));

    return result;
}

const update = (workshop) =>
    databaseContext.Workshops.update(workshop, {returning: true}).then(x => x[1]);

const getClosed = (organizerId) =>
    databaseContext.Workshops.findAll({
        include: [databaseContext.Places, databaseContext.Choreographers, databaseContext.Registrations],
        where: {
            isClosed: true,
            createdBy: organizerId
        }
});

const getUserDesiredWorkshops = (userId) => {
    databaseContext.Registrations.findAll({
        include: [
            {model: databaseContext.Workshops, include: [databaseContext.Places, databaseContext.Choreographers]},
            {model: databaseContext.Users}
        ],
        where: {
            UserId: userId,
            isPresent: false,
            isDesired: true
        }
    }).then(x => x.length == 0 ? null : x.map(i => i.Workshops.filter(w => w.isClosed == false)));
}

const approveWorkshop = (workshopId) => {
    return databaseContext.Workshops.findByPk(workshopId).then(x => {
        x.isApprovedByModerator = true;

        return update(x);
    })
}

const declineWorkshop = (workshopId, comment) => {
    return databaseContext.Workshops.findByPk(workshopId).then(x => {
        x.isClosed = true;
        x.comment = comment;

        return update(x);
    })
}

const getWorkshopsForApproval = () =>
    databaseContext.Workshops.findAll({
        include: [databaseContext.Choreographers, databaseContext.Registrations, databaseContext.Places],
        where: {
            isClosed: false,
            isApprovedByModerator: false
        }
})

const getAllForUsersAccounting = (organizerId) =>
    databaseContext.Workshops.findAll({
        include: [databaseContext.Choreographers, databaseContext.Registrations, databaseContext.Places],
        where: {
            isClosed: false,
            isApprovedByModerator: false,
            createdBy: organizerId
        }
})

const WorkshopService = {
    create,
    deleteWorkshop,
    getAll,
    getWorkshopUsers,
    getById,
    getAvailableWorkshopsForUser,
    update,
    getClosed,
    getUserDesiredWorkshops,
    approveWorkshop,
    declineWorkshop,
    getWorkshopsForApproval,
    getAllForUsersAccounting
};

export default WorkshopService;