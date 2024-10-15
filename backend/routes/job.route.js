import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, getJobsByUserId, postJob, saveJobForUser, unSaveJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route("/getSavedJobs/:id").get(getJobsByUserId);
router.route("/saveJob").post(isAuthenticated,saveJobForUser);
router.route("/unsaveJob").delete(unSaveJob);
export default router;