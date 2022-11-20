const express = require("express");
const router = express.Router();

// Declare an empty object
const data = {};
// add data to the object
data.employees = require("../../data/employees.json");

// Set up routes:
router.route("/")
    .get((req, res) => {
        res.json(data.employees);
    })
    .post((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .put((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .delete((req, res) => {
        res.json({ "id": req.body.id })
    });

router.route("/:id")
    .get((req, res) => {
        res.json({ "id": req.params.id });
    });

module.exports = router;