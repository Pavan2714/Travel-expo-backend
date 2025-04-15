const router = require("express").Router();
const hotelController = require("../controllers/hotelController");
const { verifyToken } = require("../middleware/jwt_token");

router.post("/", verifyToken, hotelController.addHotel);
router.get("/byCountry/:id", hotelController.getHotelsByCountry);
router.get("/:id", hotelController.getHotelsById);

module.exports = router;
