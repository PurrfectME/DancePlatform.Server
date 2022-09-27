import { DataTypes } from 'sequelize'; 

const Workshop = {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    style: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    photo: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
    },
    photoName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    minAge: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maxUsers: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentUsersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isApprovedByModerator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isClosed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
};


/*
        public int PlaceId { get; set; }
        public Place Place { get; set; }
        public int ChoreographerId { get; set; }
        public Choreographer Choreographer { get; set; }
        public List<Registration> Registrations { get; set; }
*/

export default Workshop;