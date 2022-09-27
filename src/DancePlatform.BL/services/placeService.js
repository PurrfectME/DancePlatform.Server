import { sequelize } from "../../app";
import { DataTypes } from "sequelize";

const Place = sequelize.define('Place', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    studioName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

/*
[Key]
        public int Id { get; set; }
        public string StudioName { get; set; }
        public string Address { get; set; }
        public int CreatedBy { get; set; }

        public List<Workshop> Workshops { get; set; }
*/

const getAll = () => {
    sequelize
}


const PlaceService = {

};

export default PlaceService;