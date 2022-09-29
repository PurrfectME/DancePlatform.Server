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
    
    return jwt.sign(username, "ExTRA_COOL_SECRET_KEY");
}

const register = (user) => {
    const validationResult = validateForm(user);
    console.log(validationResult, user)
    if(validationResult){
        return Promise.resolve({Status: "Error", Message: validationResult});
    }

    return findByEmail(user.email).then(userExists => {
        if(userExists != null){
            return Promise.resolve({ Status: "Error", Message: "Пользователь уже существует!" });
        }

        const userToCreate = {
            dateOfBirth: user.dateOfBirth,
            username: user.username,
            name: user.name,
            email: user.email,
            surname: user.surname,
            passwordHash: generateHash(user.password),
            role: user.isOrganizer ? "Organizer" : "User"
        };

        return createUser(userToCreate);
    })
}

const login = model => {
    return findByEmail(model.email).then(u => {

        if(!u){
            return Promise.reject({ Status: "Нет такой почты"});
        }

        const user = u.dataValues;

        if(user == null || user.passwordHash != generateHash(model.password)){
            return Promise.reject({ Status: "Некорректный пароль"});
        }
        const userForResponse =
        {
            role: user.role,
            registrations: user.registrations,
            email: user.email,
            id: user.id,
            userName: user.username,
            dateOfBirth: user.dateOfBirth,
            name: user.name,
            surname: user.surname,
            phoneNumber: user.phoneNumber,
            photo: user.photo == null ? null : new TextEncoder().encode(user.photo.substring(0, 23)),
        };

        return Promise.resolve({token: generateAccessToken(userForResponse.userName), user: userForResponse});
    })
}

const findById = id =>
    databaseContext.Users.findByPk(id);

const findByEmail = email =>
    databaseContext.Users.findOne({
        where: {
            email: email
        }
    });


const createUser = user => {
    return databaseContext.Users.create(user);
}

const update = user =>
    databaseContext.Users.update(user, {returning: true});

const validateForm = model => {
    if (!model.name)
    {
        return "Имя не заполнено";
    }

    if (!model.username)
    {
        return "Логин не заполнен";
    }

    if (!model.surname)
    {
        return "Фамилия не заполнена";
    }

    if (model.dateOfBirth.year == 0)
    {
        return "Дата не заполнена";
    }

    if (model.dateOfBirth.year > 2010)
    {
        return "Некорректная дата";
    }

    if (!model.email)
    {
        return "Почта не заполнена";
    }

    return "";
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
    update,
    generateHash
};

export default UserService;