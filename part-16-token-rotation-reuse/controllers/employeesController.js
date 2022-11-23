// No need for data structures, we have a database.
const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => { // No more fake .json backend: using MongoDB instead
    const employees = await Employee.find();
    if(!employees) {
        return res.status(204).json({ "message": "Get All: No Employees Found!!"});
    }
    res.status(201).json(employees); // 201 Success: Returns all employees in the DB
}

const createNewEmployee = async (req, res) => {

    if(!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ "message": "Create: First and Last Names Are Required!!!"})
        // Status 400: Bad Requests
    }

    try {   // Create a new Employee Record
        const result = await Employee.create({ // Create New Record in system
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        res.status(201).json(result); // 201 response from server: Returns the new Employee
    } catch (err) {
        console.error(err);
    }

}

// Update an existing employee:
const updateEmployee = async (req, res) => {
    
    if (!req?.body?.id) { // If there is no ID in the message:s
        return res.status(400).json({ "message": "Update: ID Parameter is REQUIRED..."});
    }

    // We have an ID if we make it here...
    const employee = await Employee.findOne({ _id: req.body.id}).exec(); // Execute database functions

    if (!employee) { // if Employee does not exist
        return res.status(204).json({ "message": `Update: No Employee ID ${req.body.id} Found in DB!!`});
    }
    if (req.body?.firstname) { // if a First Name is entered, write to file
        employee.firstname = req.body.firstname
    }
    if (req.body?.lastname) { // if a Last Name is entered, write to file
        employee.lastname = req.body.lastname
    }
    // Got rid of the development backend: We have MongoDB now
    const result = await employee.save();
    // View complete updated employee list
    res.status(201).json(result); // 201 Success: record created. Returns the updated Employee
}

const deleteEmployee = async (req, res) => {

    if(!req?.body?.id) {
        return res.status(204).json({ "message": "Delete: Employee ID Is Required!"});
    }

    const employee = await Employee.findOne({ _id: req.body.id}).exec(); // Execute database functions

    if (!employee) { // if Employee does not exist
        return res.status(204).json({ "message": `Delete: No Employee ID ${req.body.id} Found in DB!!`});
    }

    const result = await employee.deleteOne(); // { _id: req.body.id} Execute database functions

    res.status(201).json(result); // 201 Success: Returns the Deleted Employee? 
}

const getEmployee = async (req, res) => {

    if(!req?.params?.id) {
        return res.status(204).json({ "message": "Get: Employee ID Is Required!"});
    }
    const employee = await Employee.findOne({ _id: req.params.id}).exec(); // Execute database functions
    if (!employee) {
        return res.status(204).json({ "message": `Get: No Employee ID ${req.params.id} Found in DB!!`});
    }// Return only the one employee 
    res.status(201).json(employee); // Sucsess
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};