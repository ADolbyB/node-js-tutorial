const data = { // add data to the object
    employees: require("../model/employees.json"),
    setEmployees: function (data) { this.employees = data }
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
}

const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1, // Create a new ID in chronological order
        // id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1, // alternative
        firstname: req.body.firstname, // Assign first and last names
        lastname: req.body.lastname
    }
    // Make sure both first and last name are entered:
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ "message": "First and Last Names are Required!"});
    }

    // add new employees to the array:
    data.setEmployees([...data.employees, newEmployee]);
    // View complete updated employee list
    // Send status 201 for successful update
    res.status(201).json(data.employees);
}

// Update an existing employee:
const updateEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) { // if Employee does not exist
        return res.status(400).json({ "message": `Employee ID ${req.body.id} Not Found!!`});
    }
    if (req.body.firstname) { // if a First Name is entered, write to file
        employee.firstname = req.body.firstname
    }
    if (req.body.lastname) { // if a Last Name is entered, write to file
        employee.lastname = req.body.lastname
    }
    // Remove the old employee entry from array
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    // Add a new index to the array with the new updated employee information
    const unsortedArray = [...filteredArray, employee];
    data.setEmployees(unsortedArray.sort((a, b) => {
        a.id > b.id ? 1 : a.id < b.id ? -1 : 0 // Chain Ternary Operator to sort array
    }));
    // View complete updated employee list
    res.status(201).json(data.employees);
}

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} Not Found!!`});
    }
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filteredArray]);
    res.status(201).json(data.employees);
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} Not Found!!`});
    }
    // Return only the one employee 
    res.status(201).json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};