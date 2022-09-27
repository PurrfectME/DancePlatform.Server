import { DataTypes } from 'sequelize'; 

const Registration = {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    isPresent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isDesired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
};

/*
public int Id { get; set; }
		public int UserId { get; set; }
		public int WorkshopId { get; set; }
        public Workshop Workshop { get; set; }
        public User User { get; set; }
*/

export default Registration;