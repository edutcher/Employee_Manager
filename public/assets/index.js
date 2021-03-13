var currentRoles = [];
var currentManagers = [];

function addEmpToTable(emp) {
    let newRow = $('<tr>');
    let newAnchor = $('<a>').text(`${emp.first_name} ${emp.last_name}`).addClass('emp').data('id', emp.id);
    let newName = $('<td>');
    newName.append(newAnchor);
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
            $('#deptMenu').removeClass('hidden');
            $('#roleMenu').addClass('hidden');
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
            $('#deptMenu').removeClass('hidden');
            $('#roleMenu').addClass('hidden');
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
                        $('#deptMenu').addClass('hidden');
                        $('#roleMenu').removeClass('hidden');
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
            currentManagers = res.data;
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
                },
            });
        }).catch(err => {
            console.log(err);
        })
}

function addEmployee() {
    if ($('#newFirstName').val() === '' || $('#newLastName').val() === '' || $('#roleChoice').data('id') === undefined) {
        $('#newEmpErr').removeClass('hidden');
        return;
    }
    let managerID;
    if ($('#managerChoice').data('id') === undefined) managerID = null;
    else managerID = parseInt($('#managerChoice').data('id'));
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
            resetUI();
            $('#deptChoice').text('Choose Department');
            $('#deptChoice').data('id', undefined);
            $('#deptMenu').removeClass('hidden');
            $('#roleMenu').addClass('hidden');
        }).catch(err => {
            console.log(err);
        });
}

function resetUI() {
    $('.ui.modal').modal('hide');
    $('#newFirstName').val('');
    $('#newLastName').val('');
    $('#roleChoice').text('Choose Role');
    $('#roleChoice').data('id', undefined);
    $('#managerChoice').text('Choose Manager');
    $('#managerChoice').data('id', undefined);
    $('#newEmpErr').addClass('hidden');
}

function deleteEmployee() {

}

function updateEmployee() {
    if ($('#newFirstName').val() === '' || $('#newLastName').val() === '' || $('#roleChoice').data('id') === undefined) {
        $('#newEmpErr').removeClass('hidden');
        return;
    }
    if (!$('#modalTitle').data('id')) return;
    let id = $('#modalTitle').data('id');
    let managerID;
    if ($('#managerChoice').data('id') === undefined) managerID = null;
    else managerID = parseInt($('#managerChoice').data('id'));
    let updatedEmp = {
        firstName: $('#newFirstName').val(),
        lastName: $('#newLastName').val(),
        roleId: parseInt($('#roleChoice').data('id')),
        isManager: $('.checkbox').checkbox('is checked'),
        managerId: managerID
    }
    axios.put(`./api/employee/${id}`, updatedEmp)
        .then(res => {
            if ($('#deptChoice').data('id') === undefined) getAllEmployees();
            else getEmpsByDepartment($('#deptChoice').data('id'));
            resetUI();
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

    $(document).on('click', '.emp', function(e) {
        let id = $(this).data('id')
        $('#modalTitle').data('id', id);
        $('#modalTitle').text('Update Employee');
        $('#addButton').addClass('hidden').removeClass('ui');
        $('#delButton').removeClass('hidden').addClass('ui');
        $('#updateButton').removeClass('hidden').addClass('ui');
        popRoleDropdown();
        axios.get(`./api/employee/${id}`)
            .then(res => {
                $('#newFirstName').val(`${res.data[0].first_name}`);
                $('#newLastName').val(`${res.data[0].last_name}`);
                $('#roleChoice').text(`Role: ${res.data[0].title}`);
                for (let role of currentRoles) {
                    if (role.title === res.data[0].title) $('#roleChoice').data('id', role.id);
                }
                $('#managerChoice').text(`Manager: ${res.data[0].manager}`);

                for (let man of currentManagers) {
                    if ((man.first_name + " " + man.last_name) === res.data[0].manager) $('#managerChoice').data('id', man.id);
                }
                popManagerDropdown();
                $('#newEmpErr').addClass('hidden');
                $('.ui.modal').modal('show');
            })
    })

    $('.ui.dropdown')
        .dropdown({
            allowAdditions: true
        });

    $('#newEmpForm').submit((e) => {
        e.preventDefault();
        if ($('#modalTitle').data('id') === null) addEmployee();
        else updateEmployee()
    })

    $('#addEmp').click(() => {
        $('#modalTitle').data('id', null);
        $('#modalTitle').text('Add Employee');
        $('#addButton').removeClass('hidden').addClass('ui');
        $('#delButton').addClass('hidden').removeClass('ui');
        $('#updateButton').addClass('hidden').removeClass('ui');
        popRoleDropdown();
        $('#managerDropdown').dropdown();
        $('.ui.modal').modal('show');
    })

    $('#delButton').click(() => {
        deleteEmployee();
    })

    getAllEmployees();
    popDeptDropdowns();
});