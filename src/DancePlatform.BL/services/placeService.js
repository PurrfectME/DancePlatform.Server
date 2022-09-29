import databaseContext from "../../DancePlatform.DA/databaseContext.js";
import { Op } from 'sequelize';

const getAll = (organizedId) =>
    databaseContext.Places.findAll({
        where: {
            createdBy: {
                [Op.eq]: organizedId
            }
        }
    });

const getById = (id) =>
    databaseContext.Places.findByPk(id).then(x => x.dataValues);

const update = (place) =>
    databaseContext.Places.update(place, {
        where: {
            id: {
                [Op.eq]: place.id
            }
        },
    });

const create = (place) =>
    databaseContext.Places.create(place);

const deletePlace = (place) =>
    databaseContext.Places.destroy(place);

const PlaceService = {
    getAll,
    getById,
    update,
    create,
    deletePlace
};

export default PlaceService;