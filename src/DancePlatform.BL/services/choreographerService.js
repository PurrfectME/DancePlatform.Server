import databaseContext from "../../DancePlatform.DA/databaseContext.js";
import { Op } from 'sequelize';


const create = (choreographer) =>
    databaseContext.Choreographers.create(choreographer, {
        returning: true
    });

const deleteChoreographer = choreographer =>
    databaseContext.Choreographers.destroy(choreographer);

const getAll = organizerId =>
    databaseContext.Choreographers.findOne({
        where: {
            createdBy: organizerId
        }
})

const getById = id =>
    databaseContext.Choreographers.findByPk(id);

const update = choreographer =>
    databaseContext.Choreographers.update(choreographer, {
        returning: true
    });

const ChoreographerService = {
    create,
    deleteChoreographer,
    getAll,
    getById,
    update
};

export default ChoreographerService;