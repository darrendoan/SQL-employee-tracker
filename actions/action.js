const inquirer = require("inquirer");
const mysql = require("mysql2"); 
require('dotenv').config()
const dbConfig = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "employeeTracker_db",
    port: 3306
});

const actionHandlers = {
    "View all departments": viewAllDepartments,
    "View all roles": viewAllRoles,
    "View all employees": viewAllEmployees,
    "Add a department": addDepartment,
    "Add a role": addRole,
    "Add an employee": addEmployee,
    "Add a Manager": addManager,
    "Update an employee role": updateEmployeeRole,
    "View Employees by Manager": viewEmployeesByManager,
    "View Employees by Department": viewEmployeesByDepartment,
    "Delete Departments | Roles | Employees": deleteDepartmentsRolesEmployees,
    "View the total utilized budget of a department": viewTotalUtilizedBudgetOfDepartment,
    "Exit": exitApplication
};

function start() {    
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: Object.keys(actionHandlers)
        })
        .then((answer) => {
            const handler = actionHandlers[answer.action];
            if (handler) {
                handler();
            } else {
                console.log("Invalid action selected");
                start(); // Restart the prompt
            }
        });
}

function exitApplication() {
    dbConfig.end();
    console.log("Goodbye!");
}

// function to view all departments
function viewAllDepartments() {
    dbConfig.query("SELECT * FROM departments", (err, results) => {
        if (err) throw err;
        console.table(results);
        // restart the application
        start();
    });
}

// function to view all roles
function viewAllRoles() {
    dbConfig.query("SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id", (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    });
}

// function to view all employees
function viewAllEmployees() {
    dbConfig.query(`
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
    `, (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    });
}

// function to add a department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "Enter the name of the new department:",
        })
        .then((answer) => {
            console.log(answer.name);
            dbConfig.query(`INSERT INTO departments (department_name) VALUES ("${answer.name}")`, (err, results) => {
                if (err) throw err;
                console.log(`Added department ${answer.name} to the database!`);
                start();
                console.log(answer.name);
            });
        });
}

function addRole() {
   dbConfig.query("SELECT * FROM departments", (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the title of the new role:",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary of the new role:",
                },
                {
                    type: "list",
                    name: "department",
                    message: "Select the department for the new role:",
                    choices: results.map(
                        (department) => department.department_name
                    ),
                },
            ])
            .then((answers) => {
                const department = results.find(
                    (department) => department.name === answers.department
                );
                dbConfig.query("INSERT INTO roles SET ?",
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: department,
                    },
                    (err, results) => {
                        if (err) throw err;
                        console.log(
                            `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
                        );
                        start();
                    }
                );
            });
    });
}

// Function to add an employee
function addEmployee() {
    // Get list of riles from Database
    dbConfig.query("SELECT id, title FROM roles", (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        // Retrieve list of employees from the database to use as managers
        dbConfig.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }

                const managers = results.map(({ id, name }) => ({
                    name,
                    value: id,
                }));

                // Prompt the user for employee information
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: "Enter the employee's first name:",
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "Enter the employee's last name:",
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Select the employee role:",
                            choices: roles,
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Select the employee manager:",
                            choices: [
                                { name: "None", value: null },
                                ...managers,
                            ],
                        },
                    ])
                    .then((answers) => {
                        // Insert the employee into the database
                        const values = [
                            answers.firstName,
                            answers.lastName,
                            answers.roleId,
                            answers.managerId,
                        ];
                        dbConfig.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", values, (error) => {
                            if (error) {
                                console.error(error);
                                return;
                            }

                            console.log("Employee added successfully");
                            start();
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        );
    });
}
// Function to add a Manager
function addManager() {
    const queryDepartments = "SELECT * FROM departments";
    const queryEmployees = "SELECT * FROM employee";

    dbConfig.query(queryDepartments, (err, resDepartments) => {
        if (err) throw err;
        dbConfig.query(queryEmployees, (err, resEmployees) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "Select the department:",
                        choices: resDepartments.map(
                            (department) => department.department_name
                        ),
                    },
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to add a manager to:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Select the employee's manager:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                ])
                .then((answers) => {
                    const department = resDepartments.find(
                        (department) =>
                            department.department_name === answers.department
                    );
                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );
                    const manager = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.manager
                    );
                    dbConfig.query(
                        "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE department_id = ?)",
                        [manager.id, employee.id, department.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Added manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in department ${department.department_name}!`
                            );
                            start();
                        }
                    );
                });
        });
    });
}

// function to update an employee role
function updateEmployeeRole() {
    dbConfig.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id", (err, resEmployees) => {
        if (err) throw err;
        dbConfig.query("SELECT * FROM roles", (err, resRoles) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to update:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select the new role:",
                        choices: resRoles.map((role) => role.title),
                    },
                ])
                .then((answers) => {
                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );
                    const role = resRoles.find(
                        (role) => role.title === answers.role
                    );
                    dbConfig.query(
                        "UPDATE employee SET role_id = ? WHERE id = ?",
                        [role.id, employee.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
                            );
                            start();
                        }
                    );
                });
        });
    });
}
// Function to View Employee By Manager
function viewEmployeesByManager() {
    dbConfig.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employee e INNER JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id ORDER BY manager_name, e.last_name, e.first_name`, (err, results) => {
        if (err) throw err;

        // group employees by manager
        const employeesByManager = results.reduce((acc, cur) => {
            const managerName = cur.manager_name;
            if (acc[managerName]) {
                acc[managerName].push(cur);
            } else {
                acc[managerName] = [cur];
            }
            return acc;
        }, {});

        // display employees by manager
        console.log("Employees by manager:");
        for (const managerName in employeesByManager) {
            console.log(`\n${managerName}:`);
            const employees = employeesByManager[managerName];
            employees.forEach((employee) => {
                console.log(
                    `  ${employee.first_name} ${employee.last_name} | ${employee.title} | ${employee.department_name}`
                );
            });
        }
        start();
    });
}
// Function to view Employees by Department
function viewEmployeesByDepartment() {
    dbConfig.query("SELECT departments.department_name, employee.first_name, employee.last_name FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id ORDER BY departments.department_name ASC", (err, results) => {
        if (err) throw err;
        console.log("\nEmployees by department:");
        console.table(results);
        start();
    });
}
// Function to DELETE Departments Roles Employees
function deleteDepartmentsRolesEmployees() {
    inquirer
        .prompt({
            type: "list",
            name: "data",
            message: "What would you like to delete?",
            choices: ["Employee", "Role", "Department"],
        })
        .then((answer) => {
            switch (answer.data) {
                case "Employee":
                    deleteEmployee();
                    break;
                case "Role":
                    deleteRole();
                    break;
                case "Department":
                    deleteDepartment();
                    break;
                default:
                    console.log(`Invalid data: ${answer.data}`);
                    start();
                    break;
            }
        });
}
// Function to DELETE Employees
function deleteEmployee() {
    dbConfig.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        const employeeList = results.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        employeeList.push({ name: "Go Back", value: "back" }); 
        inquirer
            .prompt({
                type: "list",
                name: "id",
                message: "Select the employee you want to delete:",
                choices: employeeList,
            })
            .then((answer) => {
                if (answer.id === "back") {
                    deleteDepartmentsRolesEmployees();
                    return;
                }
                dbConfig.query("DELETE FROM employee WHERE id = ?", [answer.id], (err, results) => {
                    if (err) throw err;
                    console.log(
                        `Deleted employee with ID ${answer.id} from the database!`
                        
                    );
                    start();
                });
            });
    });
}
// Function to DELETE ROLE
function deleteRole() {
    // retrieve all roles from the database
    dbConfig.query("SELECT * FROM roles", (err, results) => {
        if (err) throw err;
        // map through the retrieved roles to create an array of choices
        const choices = results.map((role) => ({
            name: `${role.title} (${role.id}) - ${role.salary}`,
            value: role.id,
        }));
        // add a "Go Back" option to the list of choices
        choices.push({ name: "Go Back", value: null });
        inquirer
            .prompt({
                type: "list",
                name: "roleId",
                message: "Select the role you want to delete:",
                choices: choices,
            })
            .then((answer) => {
                // check if the user chose the "Go Back" option
                if (answer.roleId === null) {
                    // go back to the deleteDepartmentsRolesEmployees function
                    deleteDepartmentsRolesEmployees();
                    return;
                }
                dbConfig.query("DELETE FROM roles WHERE id = ?", [answer.roleId], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Deleted role with ID ${answer.roleId} from the database!`
                    );
                    start();
                });
            });
    });
}
// Fuction to DELETE Department
function deleteDepartment() {
    // get the list of departments
    dbConfig.query("SELECT * FROM departments", (err, results) => {
        if (err) throw err;
        const departmentChoices = results.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));

        // prompt the user to select a department
        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message: "Which department do you want to delete?",
                choices: [
                    ...departmentChoices,
                    { name: "Go Back", value: "back" },
                ],
            })
            .then((answer) => {
                if (answer.departmentId === "back") {
                    // go back to the previous menu
                    deleteDepartmentsRolesEmployees();
                } else {
                    dbConfig.query(
                        "DELETE FROM departments WHERE id = ?",
                        [answer.departmentId],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Deleted department with ID ${answer.departmentId} from the database!`
                            );
                            start();
                        }
                    );
                }
            });
    });
}
// Function to view Total Utilized Budget of Department
function viewTotalUtilizedBudgetOfDepartment() {
    dbConfig.query("SELECT * FROM departments", (err, results) => {
        if (err) throw err;
        const departmentChoices = results.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));

        // prompt the user to select a department
        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message:
                    "Which department do you want to calculate the total salary for?",
                choices: departmentChoices,
            })
            .then((answer) => {
                // calculate the total salary for the selected department
                dbConfig.query(`SELECT departments.department_name AS department, SUM(roles.salary) AS total_salary FROM departments INNER JOIN roles ON departments.id = roles.department_id INNER JOIN employee ON roles.id = employee.role_id WHERE departments.id = ? GROUP BY departments.id;`, [answer.departmentId], (err, res) => {
                    if (err) throw err;
                    const totalSalary = res[0].total_salary;
                    console.log(
                        `The total salary for employees in this department is $${totalSalary}`
                    );
                    start();
                });
            });
    });
}

module.exports = {
    start,
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    addManager,
    updateEmployeeRole,
    viewEmployeesByManager,
    viewEmployeesByDepartment,
    deleteDepartmentsRolesEmployees,
    deleteEmployee,
    deleteRole,
    deleteDepartment,
    viewTotalUtilizedBudgetOfDepartment
};