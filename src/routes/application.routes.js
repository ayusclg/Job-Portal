import Router from 'router'
import verifyToken from '../middlewares/auth.middlewares.js'
import { Upload } from '../middlewares/multer.middlewares.js'
import { applyJob } from '../controllers/application.controllers.js'

const router = Router()

router.route("/apply").post(Upload.single("CV"),verifyToken,applyJob)

export default router