# SQL Employee Tracker App

## Overview

The SQL Employee Tracker App is a command-line application designed to help businesses efficiently manage their employee data. With this app, users can perform various operations such as viewing departments, roles, and employees, adding new departments, roles, and employees, updating employee roles, and more.

## User Story
```
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria
```
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Features

- View all departments: Display a list of all departments in the company.
- View all roles: Display a list of all job roles available within the company.
- View all employees: Display a list of all employees along with their respective roles and departments.
- Add a department: Add a new department to the company.
- Add a role: Add a new job role to the company, specifying the title, salary, and department.
- Add an employee: Add a new employee to the company, specifying their first name, last name, job role, and manager (if applicable).
- Update an employee role: Update the job role of an existing employee.
- View employees by manager: Display a list of employees grouped by their respective managers.
- View employees by department: Display a list of employees grouped by their respective departments.
- Delete departments, roles, or employees: Delete existing departments, roles, or employees from the company database.
- View the total utilized budget of a department: Calculate and display the total salary budget for a specific department.

## Technologies Used

- MySQL: Database management system used to store and retrieve employee data.
- Node.js: JavaScript runtime environment used for executing the application.
- Inquirer.js: Command-line user interface library used for interactive prompts.

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
npm install
```

3. Set up the MySQL database by running the provided SQL schema and seed files.

4. Configure the database connection by updating the connection parameters in the `actions` file.

5. Start the application:

```bash
node server.js
```

## Usage

- Upon starting the application, follow the prompts to perform various operations on the employee data.
- Select an action from the provided list and follow the prompts to complete the operation.
- Use the "Exit" option to quit the application.
You may click this link to see it working: https://app.screencastify.com/v3/watch/YEdNeabpP00ufwcSiv1j 

## Issues
A few issues that I've encountered and have not been able to solve yet is the dbConfig not being recognised. Any tips are appreciated. 

## Future Implements
Bug fixing right now is the priority for this app however I would like to add some front end aspects however at this moment I am not entirely sure how to implement that YET. 

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or create a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or support, please contact Darren Doan at (doandarren95@gmail.com).

---

Feel free to customize the sections as needed and replace placeholders with actual information specific to your project.
