const { Router } = require("express");
const {
  addPlan,
  deletePlan,
  getPlan,
  updatePlan
} = require("../Controller/plan.js");
const {
  authorizedRole,
  isAuthenticate
} = require("../middleware/Authprovider.js");
const router = Router();

router.post("/add", isAuthenticate, authorizedRole("admin"), addPlan);
router.get("/get/:category", getPlan);
router.delete(
  "/delete/:id",
  isAuthenticate,
  authorizedRole("admin"),
  deletePlan
);
router.put("/update/:id", isAuthenticate, authorizedRole("admin"), updatePlan);

module.exports = router;
