var currentRoles = [];
var currentManagers = [];
var currentDepartments = [];

function getAllEmployees() {
    if (window.location.pathname === "/employees") $('#empTable').empty();
    axios.get('./api/employees')
        .then(res => {
            if (window.location.pathname === "/employees") {
                for (let emp of res.data) {
                    addEmpToTable(emp);
                }
            }
            if (window.location.pathname === "/stats") allGraph(res.data);
        }).catch(err => {
            console.log(err);
        })
}

function getDepartments() {
    axios.get('./api/departments')
        .then(res => {
            currentDepartments = res.data;
        }).catch(err => {
            console.log(err);
        })
}

function getEmpsByDepartment(id) {
    if (window.location.pathname === "/employees") $('#empTable').empty();
    axios.get(`./api/department/${id}`)
        .then(res => {
            if (window.location.pathname === "/employees") {
                for (let emp of res.data) {
                    addEmpToTable(emp);
                }
            }
            if (window.location.pathname === "/stats") deptGraph(res.data);
        }).catch(err => {
            console.log(err);
        })
}

function getManagersByDept(id) {
    return new Promise((resolve, reject) => {
        axios.get(`./api/employees/managers/${id}`)
            .then(res => {
                return resolve(res.data);
            }).catch((err) => {
                reject(err);
            })
    });
}

function getRoles() {
    return new Promise((resolve, reject) => {
        axios.get(`./api/roles`)
            .then(res => {
                return resolve(res.data);
            }).catch((err) => {
                reject(err);
            })
    });
}