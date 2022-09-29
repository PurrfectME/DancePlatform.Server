import databaseContext from "../../DancePlatform.DA/databaseContext.js";
import { Op } from 'sequelize';

const create = (workshop) =>
    databaseContext.Workshops.create(workshop);

const deleteWorkshop = workshop =>
    {
        console.log('WSWS', workshop)
        return databaseContext.Workshops.destroy({
            where: {
                id: workshop.id
            }
        });
    }

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

const getAvailableWorkshopsForUser = (userId, dateOfBirth = null) =>
    databaseContext.Workshops.findAll({
        include: [databaseContext.Choreographers, databaseContext.Registrations, databaseContext.Places],
        where: {
            isClosed: false,
            isApprovedByModerator: true,
        }
})

const update = (workshop) =>
    databaseContext.Workshops.update(workshop, {
        where: {
            id: workshop.id
        }
    });

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
        x.dataValues.isApprovedByModerator = true;

        return update(x.dataValues);
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