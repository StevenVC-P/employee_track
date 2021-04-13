const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const {config} = require('./config/connection');

const startScreen = ['View all Employees', 'View all Employees by Department', 'View all Employees by Manager','Add Employee', 'Remove Employee', 'Update Employee Role','View all Roles', 'Add Role', 'Remove Role', 'View all Departments', 'Add Department', 'Remove Department', 'Exit'];
const connection = mysql.createConnection(config);
const cTable = require('console.table');
const allEmployeeQuery = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", d.department_name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
FROM employees e
LEFT JOIN roles r 
ON r.id = e.role_id 
LEFT JOIN departments d 
ON d.id = r.department_id
LEFT JOIN employees m ON m.id = e.manager_id
ORDER BY e.id;`
const roleQuery = `SELECT * FROM roles`

const start = [
    {
    type: 'list',
    message: "What would you like to do?",
    choices: startScreen,
    name: 'response'
    },
];

// const selectDept = [
//     {
//         type:"list",
//         message: "Which department?",
//         choices: function() {
//             let deptArray = results.map(choice => choice.department_name)
//             return deptArray;
//         },
//         name:'debtChoice',
//     }
// ]

// const selectMGR = [
//     {
//         type:"list",
//         message: "Which manager?",
//         choices: function() {
//             let mgrArray = results.map(choice => choice.manager = 1)
//             return mgrArray;
//         },
//         name:'debtChoice', 
//     }
// ]

function init(){
    inquirer.prompt(start).then(res => {
        switch(res.response){
            case 'View all Employees':
                viewEmployees();
            break;
            case 'View all Employees By Department':
                viewEmployeesDepartment();
            break;
            case 'View all Employees By Manager':
                console.log("viewEmployeesManager");
            break;
            case 'Add Employee':
                console.log("addEmployee");
            break;
            case 'Remove Employee':
                removeEmployee();
            break;
            case 'Update Employee Role':
                console.log("updateRole");
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

// function viewEmployeesDepartment(){
//     connection.query('SELECT * FROM departments', (err, res) => {
//         if (err) throw err;

//         inquirer.prompt(selectDept).then((result) => {
//             const query = 'SELECT employee.id, role.title AS "Title, employee.first_name AS "First Name", employee.last_name AS "Last Name",  department.department_name AS "Department", rolessalary AS "Salary" FROM employees e INNER JOIN roles r ON rolesid = employee.role_if INNER JOIN departments d ON department.id = rolemployee.department_id WHERE?;';
//             connection.query(query, {department_name: result.department_name}, (err, res) => {
//             if (err) throw err;
//             console.log(' ');
//             console.table(chalk.green((`All Employees by Department: ${result.department_name}`)), res)
//             init();
//             })
//         })
//     })
// };

// function viewEmployeesManager(){
//     const mgrQuery = 'SELECT * FROM employees '
//     connect.query(mgrQuery, (err, res) => {
//         if (err) throw err;
//         inquirer.prompt(selectMGR).then((result) => {
//         })
//     })
// };

function addEmployee(){
    connection.query(roleQuery, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                message: "Employee's first name?",
                name: 'firstName',
            },
            {
                type: 'input',
                message: "Employee's last name?",
                name: 'lastName',
            },
            {
                type: 'list',
                message: "Employee's job title?",
                name: 'role',
                choices: function () {
                    let choiceArray = results[0].map(choice => choice.title);
                    return choiceArray;
                },
                
            },
        ]).then((result) =>{
        connection.query(`INSERT INTO employees(first_name, last_name, role_id) VALUES(?, ?,
            (SELECT id FROM roles WHERE title = ?)`,
        [result.firstname, result.lastname, result.role,])
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
// function addRole(){

// };

// function updateRole(){

// };

function viewRole(){
    connection.query(`SELECT title AS "Title" FROM roles`, (err, res) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All Roles'), res)
        init();
    })
};

function addRole(){
    connection.query(`SELECT FROM roles; SELECT FROM departments`, (err, res) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All Roles'), res)
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
                message: 'Select the Department for this new Title:',
                choices() {
                const choiceArray = [];
                res.forEach(({ department_name }) => {
                  choiceArray.push(department_name);
                });
                return choiceArray;
                },
                name: 'deptName'
            }
        ]).then((response) => {
            connection.query(`INSERT INTO roles(title, salary, department_id) VALUES(?)`, 
            response.newTitle, response.newSalary, {department_name: response.deptName})
            init();
        })
    })

};;

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
    connection.query(`SELECT department_name AS "Department Name" FROM departments`, (err, res) => {
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
connection.connect((err) => {
    if (err) throw err;
    init()
});