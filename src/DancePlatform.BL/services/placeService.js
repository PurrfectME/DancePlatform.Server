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
    databaseContext.Places.findByPk(id);

const update = (place) =>
    databaseContext.Places.update(place, {
        where: {
            id: {
                [Op.eq]: place.id
            }
        },
        returning: true
    }).then(x => x[1]);

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