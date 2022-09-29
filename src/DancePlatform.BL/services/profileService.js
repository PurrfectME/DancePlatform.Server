import databaseContext from "../../DancePlatform.DA/databaseContext.js";

const deleteUserPhoto = userId => {
    return databaseContext.Users.findByPk(userId).then(user => {
        user.photo = null;

        return databaseContext.Users.update(user);
    })
}

const getUserPhoto = id =>
    databaseContext.Users.findByPk(id).then(x => x.photo);

const uploadImage = (imgBytes, userId) => {
    return databaseContext.Users.findByPk(userId).then(user => {
        user.photo = imgBytes;

        return databaseContext.Users.update(user);
    })
}

const ProfileService = {
    deleteUserPhoto,
    getUserPhoto,
    uploadImage
};


export default ProfileService;