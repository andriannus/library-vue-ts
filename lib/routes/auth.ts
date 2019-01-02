import { Router } from "express";
import { AuthController } from "../controllers/auth";

const authController = new AuthController();
const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/checkEmail", authController.checkEmail);
router.post("/checkUsername", authController.checkUsername);
router.post("/refreshToken", authController.refreshToken);

export { router as authRouter };
