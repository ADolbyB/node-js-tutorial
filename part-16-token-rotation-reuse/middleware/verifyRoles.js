const verifyRoles = (...allowedRoles) => { // We need to return a middleware function
    /// Pass in as many parameters as we wish with rest operator
    return (req, res, next) => {
        if(!req?.roles) { 
            return res.sendStatus(401);
        }
        const rolesArray = [...allowedRoles];
        console.log("Allowed Roles: " + rolesArray); // Display output all role array indicies
        console.log("Role Requirements: " + req.roles); // Debug: These are required minimum roles
        
        // New Array will have a bunch of True/False values
        // roles are assigned in the verifyJWT.js
        // map result to a new array
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        // to verify individual roles
        if (!result) {
            return res.sendStatus(401); // 401 Unauthorized: You are not assigned a high enough role
        }
        // Otherwise, you are good to go:
        next(); // Let route be accessed
    }
}

module.exports = verifyRoles;