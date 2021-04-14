const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const {config} = require('./config/connection');
const logo = require("asciiart-logo");

const startScreen = ['View all Employees','Add Employee', 'Remove Employee', 'View all Roles', 'Add Role', 'Remove Role', 'View all Departments', 'Add Department', 'Remove Department', 'Exit'];
const connection = mysql.createConnection(config);
const cTable = require('console.table');
const allEmployeeQuery = 
`SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", d.department_name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary",
CONCAT(m.first_name," ",m.last_name) AS "Manager"
FROM employees e
LEFT JOIN roles r ON r.id = e.role_id 
LEFT JOIN departments d ON d.id = r.department_id 
LEFT JOIN employees m ON m.id = e.manager_id
ORDER BY e.id;`

const start = [
    {
    type: 'list',
    message: "What would you like to do?",
    choices: startScreen,
    name: 'response'
    },
];

function init(){
    inquirer.prompt(start).then(res => {
        switch(res.response){
            case 'View all Employees':
                viewEmployees();
            break;
            case 'Add Employee':
                addEmployee();
            break;
            case 'Remove Employee':
                removeEmployee();
            break;
            case 'View all Roles':
                viewRole();
            break;
            case 'Add Role':
                addRole();
            break;
            case 'Remove Role':
                removeRole();
            break;
            case 'View all Departments':
                viewDepartments();
            break;
            case 'Add Department':
                addDepartment();
            break;
            case 'Remove Department':
                removeDepartment();
            break;
            case 'Exit':
                connection.end();
            break;
            default: console.log("default");
        }
    })
};

function viewEmployees(){
    connection.query(allEmployeeQuery, (err, res) => {
     if (err) throw err;
     console.log(' ');
     console.table(chalk.green('All Employees'), res)
     init();
    })
};

function addEmployee(){
     connection.query(allEmployeeQuery, (err, res) => {
        if (err) throw err;
        console.table(chalk.green('All Roles'), res)
        inquirer.prompt([
            {
                type: 'input',
                message: "Whats is their first name?",
                name: 'firstName'
            },
            {
                type: 'input',
                message: "Whats is their last name?",
                name: 'lastName'
            },
            {
                type: 'list',
                choices() {
                    const choiceArray = [];
                    res.forEach(({Title}) => {
                        if (!choiceArray.includes(Title)){
                        choiceArray.push(Title)}
                    });
                    return choiceArray;
                },
                message: 'What is thier job title',
                name: 'role'
            },
            {
                type: 'list',
                choices() {
                    const choiceArray = [];
                    res.forEach(({Manager}) => {
                        if (!choiceArray.includes(Manager)){
                        choiceArray.push(Manager)}
                    });
                    return choiceArray;
                },
                message: 'Who is thier manager?',
                name: 'manager'
            },
        ]).then((response) => {
            connection.query(
                `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
                    (SELECT id FROM roles WHERE title = ?),
                    (SELECT id FROM (SELECT id FROM employees WHERE CONCAT(m.first_name," ",m.last_name) = ?)))`,
                    [response.firstName, response.lastName, response.role, response.manager]
            )
            init();
        })
    })
};

function removeEmployee(){
    connection.query(allEmployeeQuery, (err, res) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All Employees'), res)
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the Employee ID of the person to remove:',
                name: 'idRemove'
            }
        ]).then((response) => {
            connection.query(`DELETE FROM employees WHERE ?`, { id: response.idRemove })
            init();
            })
    })
};

function viewRole(){
    connection.query(`SELECT * FROM roles`, (err, res) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All Roles'), res)
        init();
    })
};

function addRole(){
    connection.query("SELECT * FROM roles r LEFT JOIN departments ON departments.id = r.department_id", (err, res) => {
            if (err) throw err;
            console.log('');
            console.table(chalk.green('List of current Roles:'), res);
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the new Title:',
                name: 'newTitle'
            },
            {
                type: 'input',
                message: 'Enter the salary for the new Title:',
                name: 'newSalary'
            },
            {
                type: 'list',
                message: 'What department is this role apart of?',
                choices() {
                    const choiceArray = [];
                    res.forEach(({ id }) => {
                        if (!choiceArray.includes(id)){
                        choiceArray.push(id)}
                    });
                    return choiceArray;
                },
                name: 'department',
            },
        ]).then((response) => {
            connection.query(`INSERT INTO roles SET?`, 
            {
                title: response.newTitle,
                salary: response.newSalary,
                department_id: response.department
            },
            (err) => {if (err) throw err;
            })
            init();
        })
    })
};

function removeRole(){
    connection.query(`SELECT * FROM roles`, (err, res) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All roles'), res)
        inquirer.prompt([
            {
                
                type: 'list',
                message: 'Select the Role ID to remove:',
                choices() {
                    const choiceArray = [];
                    res.forEach(({ id }) => {
                      choiceArray.push(id);
                    });
                    return choiceArray;
                },
                name: 'roleRemove'
            }
        ]).then((response) => {
            connection.query(`DELETE FROM roles WHERE ?`, { id: response.roleRemove })
            console.log(response);
            init();
        })
    })
};

function viewDepartments(){
    connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All Departments'), res)
        init();
    })
};

function addDepartment(){
    connection.query(`Select department_name AS "Department Name" FROM departments`, (err, res) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All Departments'), res)
        inquirer.prompt([
            {
                type: "input",
                message: "What is the department's name?",
                name:"newDeptName"
            }
        ]).then((response) => {
            connection.query(`INSERT INTO departments(department_name) VALUES(?)`, response.newDeptName)
            init();
        })
    })

};

function removeDepartment(){
    connection.query(`SELECT * FROM Departments`, (err, res) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All Departments'), res)
        inquirer.prompt([
            {
                
                type: 'list',
                message: 'Select the Department ID to remove:',
                choices() {
                    const choiceArray = [];
                    res.forEach(({ id }) => {
                      choiceArray.push(id);
                    });
                    return choiceArray;
                },
                name: 'deptRemove'
            }
        ]).then((response) => {
            connection.query(`DELETE FROM departments WHERE ?`, { id: response.deptRemove })
            console.log(response);
            init();
        })
    })
};

function displayLogo(){
    const logoText = logo(
        {
        name: "My Employee Tracker",
        lineChars: 20,
        padding: 2,
        margin: 2,
        borderColor: 'blue',
        logoColor: 'yellow',
        }
    ).render();
console.log(logoText);
}

connection.connect((err) => {
    if (err) throw err;
    displayLogo();
    init();
});