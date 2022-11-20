const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");

// Set up routes: Functions are now defined in employeesController.js
// These are our REST API functions
router.route("/")
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route("/:id")
    .get(employeesController.getEmployee);

module.exports = router;