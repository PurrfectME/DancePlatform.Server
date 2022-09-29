import databaseContext from "../../DancePlatform.DA/databaseContext.js";
import { Op } from 'sequelize';


const create = (choreographer) =>
    databaseContext.Choreographers.create(choreographer, {
        returning: true
    });

const deleteChoreographer = choreographer =>
    databaseContext.Choreographers.destroy(choreographer);

const getAll = organizerId =>
    databaseContext.Choreographers.findAll({
        where: {
            createdBy: organizerId
        }
})

const getById = id =>
    databaseContext.Choreographers.findByPk(id);

const update = choreographer =>
    databaseContext.Choreographers.update(choreographer, {
        where: {
            id: {
                [Op.eq]: choreographer.id
            }
        },
    });

const ChoreographerService = {
    create,
    deleteChoreographer,
    getAll,
    getById,
    update
};

export default ChoreographerService;