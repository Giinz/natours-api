const multer = require("multer");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/users");
    },
    filename: (req, file, cb) => {
        const ext = file.minetype.split("/")[1];
        cb(null, `user-${req.user.id}-${Date.noew()}.${ext}`);
    },
});

const multerFilter = (erq, file, cb) => {
    if (!file.minetype.startsWith("image")) {
        cb(new AppError("Not an image! Please upload only image!", 400), false);
    }
    cb(null, true);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single("photo");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    //Send Respone
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError("This route is not for password update. Please use /updateMyPassword", 400));
    }
    // Update user document
    const filteredBody = filterObj(req.body, "name", "email");
    if(req.file) filteredBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "Succes",
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.getUserById = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined",
    });
};
exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined",
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined",
    });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined",
    });
};
