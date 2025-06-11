
import { Router } from "express";
import { SetupDetailsController } from "../controllers/setup-details";

export const SetupDetailsRouter = Router();

SetupDetailsRouter.get("/:setup_id", SetupDetailsController.getDetails);
SetupDetailsRouter.patch("/:setup_id",SetupDetailsController.updateDetails);
SetupDetailsRouter.post("/", SetupDetailsController.createDetails);
