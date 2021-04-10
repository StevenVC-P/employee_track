const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const cTable = require('console.table');
const startScreen = ['View all Employees', 'View all Emplyees by Department', 'View all Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager','View all Roles', 'Add Role', 'Remove Role', 'View all Departments', 'Add Department', 'Remove Department', 'Exit']


const start = [
    {
    type: 'list',
    message: "What would you like to do?",
    choices: startScreen,
    name: 'initial'
    }
]

function init(){
    inquirer.prompt(start).then(data => {
        switch (data.initial){
            case "View all Employees":
                viewEmployees();
            break;
            case "View all Employees By Department":
                viewEmployeesDepartment();
            break;
            case "View all Employees By Manager":
                viewEmployeesManager();
            break;
            case "Add Employee":
                addEmployee();
            break;
            case "Remove Employee":
                removeEmployee();
            break;
            case "Update Employee Role":
                updateRole();
            break;
            case "View all Roles":
                viewRole();
            break;
            case "Add Role":
                addRole();
            break;
            case "Remove Role":
                removeRole();
            break;
            case "View all Departments":
                viewDepartments();
            break;
            case "Add Department":
                addDepartment();
            break;
            case "Remove Department":
                removeDepartment();
            break;
            case "Exit":
                exit();
            break;
        }
    })
};

function viewEmployees(){

};

function viewEmployeesDepartment(){

};

function viewEmployeesManager(){

};

function addEmployee(){

};

function removeEmployee(){

};

function updateRole(){

};

function updateRole(){

};

function viewRole(){

};

function addRole(){

};

function removeRole(){

};

function viewDepartments(){

};

function addDepartment(){

};

function removeDepartment(){

};

function exit(){

};


init();