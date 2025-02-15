import Router from 'router'
import verifyToken from '../middlewares/auth.middlewares.js'
import { Upload } from '../middlewares/multer.middlewares.js'
import { applyJob, fetchAllApply, fetchSingleUserApply } from '../controllers/application.controllers.js'

const router = Router()

router.route("/apply").post(Upload.single("CV"),verifyToken,applyJob)
router.route("/single").get(verifyToken,fetchSingleUserApply)
router.route("/all").get(fetchAllApply)
export default router