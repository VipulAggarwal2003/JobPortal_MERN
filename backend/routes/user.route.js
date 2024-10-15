import express from "express";
import { deleteProfile, login,logout,register, updateProfile} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { multipleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(multipleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,multipleUpload, updateProfile);
router.route("/deleteProfile/:id").delete(deleteProfile);
export default router;
