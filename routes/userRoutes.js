const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/updateMe", userController.uploadUserPhoto, authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router.patch("/updateMyPassword", authController.protect, authController.updatePassword);

router.route("/").get(userController.getAllUsers).post(userController.createUser);
router.route("/:id").get(userController.getUserById).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
