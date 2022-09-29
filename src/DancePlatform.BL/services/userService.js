import databaseContext from "../../DancePlatform.DA/databaseContext.js";
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';

function generateHash(string) {
    var hash = 0;
    if (string.length == 0)
        return hash;
    for (let i = 0; i < string.length; i++) {
        var charCode = string.charCodeAt(i);
        hash = ((hash << 7) - hash) + charCode;
        hash = hash & hash;
    }
    return hash;
}

const generateAccessToken = (username) => {
    return jwt.sign(username, "ExTRA_COOL_SECRET_KEY", { expiresIn: '3800s' });
}

const register = (user) => {
    const validationResult = validateForm(user);

    if(!validationResult[0]){
        return {Status: "Error", Message: validationResult[1]}
    }

    return findByEmail(user.email).then(userExists => {
        if(userExists != null){
            return { Status: "Error", Message: "Пользователь уже существует!" };
        }

        const userToCreate = {
            dateOfBirth: user.dateOfBirth,
            username: user.username,
            name: user.name,
            email: user.email,
            passwordHash: generateHash(user.password),
            role: user.isOrganizer ? "Organizer" : "User"
        };

        return createUser(userToCreate).then(x => x);
    })
}

const login = model => {
    return findByEmail(model.email).then(user => {


        if(user == null || user.passwordHash != generateHash(model.password)){
            return { Status: "Unauthorized"};
        }

        const userForResponse =
        {
            email: user.email,
            id: user.id,
            userName: user.userName,
            dateOfBirth: user.dateOfBirth,
            name: user.name,
            surname: user.surname,
            phoneNumber: user.phoneNumber,
            photo: user.photo == null ? null :  Uint8Array.from(atob(user.photo), c => c.charCodeAt(0)),
        };

        return {token: generateAccessToken(userForResponse.userName), user: userForResponse};
    })
}

const findById = id =>
    databaseContext.Users.findByPk(id);

const findByEmail = email =>
    databaseContext.Users.findOne(email);


const createUser = user => {
    return databaseContext.Users.create(user);
}

const update = user =>
    databaseContext.Users.update(user, {returning: true});

const validateForm = model => {
    if (!model.Name)
    {
        return (false, "Имя не заполнено");
    }

    if (!model.Surname)
    {
        return (false, "Фамилия не заполнена");
    }

    if (model.DateOfBirth.Year == 0001)
    {
        return (false, "Дата не заполнена");
    }

    if (model.DateOfBirth.Year > 2010)
    {
        return (false, "Некорректная дата");
    }

    if (!model.Email)
    {
        return (false, "Почта не заполнена");
    }

    return [true, ""];
}

const findByRole = role =>
    databaseContext.Users.findOne({
        where:{
            role: role
        }
    })

const UserService = {
    generateAccessToken,
    register,
    login,
    findById,
    findByRole,
    createUser,
    update
};

export default UserService;