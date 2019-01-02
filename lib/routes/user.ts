import { Router } from "express";
import { UserController } from "../controllers/user";
import { isAuthentication } from "../middlewares/authentication";

const userController = new UserController();
const router = Router();

router.post("/updateName", isAuthentication, userController.updateName);
router.post("/updateUsername", isAuthentication, userController.updateUsername);

export { router as userRouter };
