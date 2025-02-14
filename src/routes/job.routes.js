import verifyToken from "../middlewares/auth.middlewares.js"
import Router from "router";
import { createJob, deleteJob, fetchJobs, getJob, updateJob } from "../controllers/job.controller.js"


const router = Router()

router.route("/create").post(verifyToken,createJob)
router.route("/fetch").get(fetchJobs)
router.route("/single/:_id").get(getJob)
router.route("/update/:_id").patch(verifyToken,updateJob)
router.route("/delete/:_id").delete(verifyToken,deleteJob)



export default router