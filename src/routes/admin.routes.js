import Router from "router"
import { deleteUser, fetchAllUser } from "../controllers/admin.controllers.js"
import verifyToken from "../middlewares/auth.middlewares.js"


const router = Router()

router.route("/all").get(verifyToken,fetchAllUser)
router.route("/delete/:_id").delete(verifyToken,deleteUser)

export default router