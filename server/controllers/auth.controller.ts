import { Router } from "express";
import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";
import authenticationMiddleware from "../middlewares/authentication.middleware";
import registrationMiddleware from "../middlewares/registration.middleware";
import jwtMiddleware from "../middlewares/jwt.middleware";
import {
  googleMiddleware,
  googleCallbackMiddleware
} from "./../middlewares/google.middleware";
import {
  facebookMiddleware,
  facebookCallbackMiddleware
} from "./../middlewares/facebook.middleware";

const router = Router();

router
  .post("/register", registrationMiddleware, (req, res, next) =>
    authService
      .register(req.user)
      .then(data => res.send(data))
      .catch(next)
  )
  .get("/google", googleMiddleware)
  .get("/google/redirect", googleCallbackMiddleware, (req, res, next) =>
    authService
      .login(req.user)
      .then(data => res.send(data))
      .catch(next)
  )
  .post("/reset", (req, res, next) =>
    authService
      .reset(req.body.email)
      .then(() => res.sendStatus(200))
      .catch(next)
  )
  .post("/restore", (req, res, next) =>
    authService
      .restore(req.body.password, req.body.token)
      .then(() => res.sendStatus(200))
  )
  .get("/facebook", facebookMiddleware)
  .get("/facebook/redirect", facebookCallbackMiddleware, (req, res, next) =>
    authService
      .login(req.user)
      .then(data => res.send(data))
      .catch(next)
  )
  .post("/login", authenticationMiddleware, (req, res, next) =>
    authService
      .login(req.user)
      .then(data => res.send(data))
      .catch(next)
  )
  .get("/user", jwtMiddleware, (req, res, next) => {
    userService
      .getUserById(req.user.id)
      .then(data => res.send(data))
      .catch(next);
  });

export default router;
