import express from "express";
import { avtarController, getAllAvatars } from "../controllers/avatarController.js";

 const route=express.Router();

 route.post("/",avtarController);
 route.get("/all",getAllAvatars)

 export default route;