import { DataTypes } from 'sequelize'; 

const User = {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    photo: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
};

/*
public DateTimeOffset DateOfBirth { get; set; }
        public byte[] Photo { get; set; }
        public string Surname { get; set; }
        public string Name { get; set; }
        public List<Registration> Registrations { get; set; }
*/

export default User;