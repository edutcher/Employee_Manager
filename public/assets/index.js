var currentRoles = [];

function addEmpToTable(emp) {
    let newRow = $('<tr>');
    let newName = $('<td>').text(`${emp.first_name} ${emp.last_name}`);
    let newRole = $('<td>').text(`${emp.title}`);
    let newSalary = $('<td>').text(`${emp.salary}`);
    let newDept = $('<td>').text(`${emp.name}`);
    let newMgr;
    if (emp.manager === null) newMgr = $('<td>').text('Department Head');
    else newMgr = $('<td>').text(`${emp.manager}`);
    newRow.append(newName, newRole, newSalary, newDept, newMgr);
    $('#empTable').append(newRow);
}

function getEmpsByDepartment(id) {
    $('#empTable').empty();
    axios.get(`./api/department/${id}`)
        .then(res => {
            for (let emp of res.data) {
                addEmpToTable(emp);
            }
        }).catch(err => {
            console.log(err);
        })
}

function getAllEmployees() {
    $('#empTable').empty();
    axios.get('./api/employees')
        .then(res => {
            for (let emp of res.data) {
                addEmpToTable(emp);
            }
        }).catch(err => {
            console.log(err);
        })
}

function empSearch(first, last) {
    $('#empTable').empty();
    axios.post('./api/employee/search', { firstName: first, lastName: last })
        .then(res => {
            for (let emp of res.data) {
                addEmpToTable(emp);
            }
        }).catch(err => {
            console.log(err);
        })
}

function popDeptDropdowns() {
    $('#deptDropdown').addClass('loading');
    $('#deptDrop').empty();
    let newItem = $('<div>').addClass('item').text(`All`);
    newItem.data('id', 1);
    $('#deptDrop').append(newItem);
    axios.get('./api/departments')
        .then(res => {
            for (let dept of res.data) {
                let newItem = $('<div>').addClass('item').text(`${dept.name}`);
                newItem.data('id', dept.id);
                $('#deptDrop').append(newItem);
            }
            $('#deptDropdown').removeClass('loading');
            $('#deptDropdown')
                .dropdown({
                    onChange: function(value, text, $selectedItem) {
                        if ($selectedItem.data('id') === 1) getAllEmployees();
                        else getEmpsByDepartment($selectedItem.data('id'));
                        $('#deptChoice').text(`Department: ${text}`);
                        $('#deptChoice').data('id', value);
                    }
                });
        }).catch(err => {
            console.log(err);
        });
}

function popRoleDropdown() {
    $('#roleDropdown').addClass('loading');
    $('#roleDrop').empty();
    axios.get('./api/roles')
        .then(res => {
            currentRoles = res.data;
            let roles = [];
            for (let role of res.data) {
                let newRole = { value: role.id, name: role.title, text: role.title };
                roles.push(newRole);
            }
            $('#roleDropdown').removeClass('loading');
            $('#roleDropdown').dropdown('change values', roles);
            $('#roleDropdown').dropdown({
                onChange: function(value, text, $selectedItem) {
                    $('#roleChoice').text(`Role: ${text}`);
                    $('#roleChoice').data('id', value);
                    popManagerDropdown();
                },
            });
        }).catch(err => {
            console.log(err);
        });
}

function popManagerDropdown() {
    $('#managerDropdown').addClass('loading');
    $('#managerDrop').empty();
    let id;
    for (let role of currentRoles) {
        if (role.id == $('#roleChoice').data('id')) {
            id = role.department_id;
            break;
        }
    }
    if (id === undefined) return;
    axios.get(`./api/employees/managers/${id}`)
        .then(res => {
            let managers = [];
            for (let manager of res.data) {
                let newName = manager.first_name + ' ' + manager.last_name;
                let newManager = { value: manager.id, name: newName, text: newName };
                managers.push(newManager);
            }
            $('#managerDropdown').removeClass('loading');
            $('#managerDropdown').dropdown('change values', managers);
            $('#managerDropdown').dropdown({
                onChange: function(value, text, $selectedItem) {
                    $('#managerChoice').text(`Manager: ${text}`);
                    $('#managerChoice').data('id', value);
                    console.log(value);
                },
            });
        }).catch(err => {
            console.log(err);
        })
}

function addEmployee() {
    if ($('#newFirstName').val() === '' || $('#newLastName').val() === '' || $('#roleChoice').data('id') === undefined) {
        return;
    }
    let managerID;
    if ($('#managerChoice').data('id') === undefined) managerID = null;
    else managerID = parseInt($('#managerChoice').data('id'));
    console.log(managerID);
    let newEmp = {
        firstName: $('#newFirstName').val(),
        lastName: $('#newLastName').val(),
        roleId: parseInt($('#roleChoice').data('id')),
        isManager: $('.checkbox').checkbox('is checked'),
        managerId: managerID
    }
    axios.post(`./api/employee`, newEmp)
        .then(res => {
            empSearch(newEmp.firstName, newEmp.lastName);
            $('.ui.modal').modal('hide');
            $('#newFirstName').val('');
            $('#newLastName').val('');
            $('#roleChoice').text('Choose Role');
            $('#roleChoice').data('id', undefined);
            $('#managerChoice').text('Choose Manager');
            $('#managerChoice').data('id', undefined);
            $('#deptChoice').text('Choose Department');
            $('#deptChoice').data('id', undefined);
        }).catch(err => {
            console.log(err);
        });
}



$(document).ready(() => {

    $('#searchForm').submit((e) => {
        e.preventDefault();
        if ($('#firstName').val() != '' || $('#lastName').val() != '') {
            empSearch($('#firstName').val(), $('#lastName').val());
        }
    })

    $('.ui.dropdown')
        .dropdown({
            allowAdditions: true
        });

    $('#newEmpForm').submit((e) => {
        e.preventDefault();
        addEmployee();
    })

    $('#addEmp').click(() => {
        popRoleDropdown();
        $('#managerDropdown').dropdown();
        $('.ui.modal').modal('show');
    })

    getAllEmployees();
    popDeptDropdowns();
});