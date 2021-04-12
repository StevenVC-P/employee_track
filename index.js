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

const newEmployee = [
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
        type: 'input',
        message: "Employee's department?",
        name: 'department',
    },
    {
        type: 'input',
        message: "Employee's job title?",
        name: 'role',
    },
    {
        type: 'input',
        message: "Employee's salary?",
        name: 'salary',
    },
    {
        type: 'confirm',
        message: "Is this employee a manager?",
        name: 'mgrStatus',
    },
    {
        type: 'list',
        message: "Who is this employee's manager?",
        choices: function() {
            //Get an arrary of all managers + option for none.
        },
        name: 'mgrName',
    },
]


function init(){
    inquirer.prompt(start).then(res => {
        switch(res.response){
            case 'View all Employees':
                viewEmployees();
            break;
            case 'View all Employees By Department':
                console.log("viewEmployeesDepartment");
            break;
            case 'View all Employees By Manager':
                console.log("viewEmployeesManager");
            break;
            case 'Add Employee':
                console.log("addEmployee");
            break;
            case 'Remove Employee':
                console.log("removeEmployee");
            break;
            case 'Update Employee Role':
                console.log("updateRole");
            break;
            case 'View all Roles':
                console.log("viewRole");
            break;
            case 'Add Role':
                console.log("addRole");
            break;
            case 'Remove Role':
                console.log("removeRole");
            break;
            case 'View all Departments':
                console.log("viewDepartments");
            break;
            case 'Add Department':
                console.log("addDepartment");
            break;
            case 'Remove Department':
                console.log("removeDepartment");
            break;
            case 'Exit':
                console.log("exit");
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

function viewEmployeesDepartment(){
    const deptQuery = 'SELECT * FROM departments';
    connection.query(deptQuery, (err, res) => {
        if (err) throw err;

        inquirer.prompt(selectDept).then((result) => {
            const query = 'SELECT employee.id, role.title AS "Title, employee.first_name AS "First Name", employee.last_name AS "Last Name",  department.department_name AS "Department", rolessalary AS "Salary" FROM employees e INNER JOIN roles r ON rolesid = employee.role_if INNER JOIN departments d ON department.id = rolemployee.department_id WHERE?;';
            connection.query(query, {department_name: result.department_name}, (err, res) => {
            if (err) throw err;
            console.log(' ');
            console.table(chalk.green((`All Employees by Department: ${result.department_name}`)), res)
            init();
            })
        })
    })
};

// function viewEmployeesManager(){
//     const mgrQuery = 'SELECT * FROM employees '
//     connect.query(mgrQuery, (err, res) => {
//         if (err) throw err;
//         inquirer.prompt(selectMGR).then((result) => {
//         })
//     })
// };

function addEmployee(){
    inquirt.prompt(newEmployee).then((result) =>{
        connection.query("INSERT INTO employees SET?",
        {
            first_name: result.firstname,
            last_name: result.lastname,
            department: result.department,
            role: result.role,
            salary: result.salary

        })
    })
};
// function removeEmployee(){

// };

// function updateRole(){

// };

// function updateRole(){

// };

// function viewRole(){

// };

// function addRole(){

// };

// function removeRole(){

// };

// function viewDepartments(){

// };

// function addDepartment(){

// };

// function removeDepartment(){

// };

// function exit(){

// };

init();

