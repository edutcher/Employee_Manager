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

function resetUI() {
    $('.ui.modal').modal('hide');
    $('#newFirstName').val('');
    $('#newLastName').val('');
    $('#roleChoice').text('Choose Role');
    $('#roleChoice').data('id', undefined);
    $('#managerChoice').text('Choose Manager');
    $('#managerChoice').data('id', undefined);
    $('#newEmpErr').addClass('hidden');
    $('#newDept').val('');
    $('#newDeptBudget').val('');
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
            $('#delDeptBtn').addClass('hidden').removeClass('ui');
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
        }).catch(err => {
            console.log(err);
        });
}

function deleteEmployee() {
    if (!$('#modalTitle').data('id')) return;
    let id = $('#modalTitle').data('id');
    axios.delete(`./api/employee/${id}`)
        .then(res => {
            if ($('#deptChoice').data('id') === undefined) getAllEmployees();
            else getEmpsByDepartment($('#deptChoice').data('id'));
            resetUI();
        })
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

    popDeptDropdowns();

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

                if (res.data[0].manager === null) $('#managerChoice').text('Department Head');
                else $('#managerChoice').text(`Manager: ${res.data[0].manager}`);

                for (let man of currentManagers) {
                    if ((man.first_name + " " + man.last_name) === res.data[0].manager) $('#managerChoice').data('id', man.id);
                }
                popManagerDropdown();
                $('#newEmpErr').addClass('hidden');
                $('#empModal').modal('show');
            })
    })

    $('.ui.dropdown')
        .dropdown({
            allowAdditions: true
        });

    $('#newEmpForm').submit((e) => {
        e.preventDefault();
        if ($('#modalTitle').data('id') === undefined) addEmployee();
        else updateEmployee()
    })

    $('#addEmp').click(() => {
        $('#modalTitle').data('id', undefined);
        $('#modalTitle').text('Add Employee');
        $('#addButton').removeClass('hidden').addClass('ui');
        $('#delButton').addClass('hidden').removeClass('ui');
        $('#updateButton').addClass('hidden').removeClass('ui');
        popRoleDropdown();
        $('#managerDropdown').dropdown();
        $('#empModal').modal('show');
    })

    $('#delButton').click(() => {
        $('#delEmpModal').modal('show');
    })

    $('#confirmDelEmp').click(() => {
        deleteEmployee();
    })

    getAllEmployees();

});