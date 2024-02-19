
const { start, viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, addManager, updateEmployeeRole, viewEmployeesByManager, viewEmployeesByDepartment, deleteDepartmentsRolesEmployees, deleteEmployee, deleteRole, deleteDepartment, viewTotalUtilizedBudgetOfDepartment } = require("./actions/action");
require('dotenv').config()
start();

// close the connection when the application exits
process.on("exit", () => {
    dbConfig.end();
}); 