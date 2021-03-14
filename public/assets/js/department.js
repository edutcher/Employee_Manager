function addDepartment() {
    let newDept = {
        name: $('#newDept').val(),
        budget: $('#newDeptBudget').val()
    }
    axios.post('./api/department', newDept)
        .then(res => {
            if ($('#deptChoice').data('id') === undefined) getAllEmployees();
            else getEmpsByDepartment($('#deptChoice').data('id'));
            popDeptDropdowns();
            resetUI();
        })
}

function addRole() {
    if ($('#newRoleTitle').val() === '' || $('#newRoleSalary').val() === '' || $('#deptChoice').data('id') === undefined) return;
    let newRole = {
        title: $('#newRoleTitle').val(),
        salary: $('#newRoleSalary').val(),
        departmentId: $('#deptChoice').data('id')
    }
    axios.post('./api/role', newRole)
        .then(res => {
            if ($('#deptChoice').data('id') === undefined) getAllEmployees();
            else getEmpsByDepartment($('#deptChoice').data('id'));
            resetUI();
        })
}

$(document).ready(async() => {

    $('.ui.dropdown')
        .dropdown({
            allowAdditions: true
        });

    $('#newDeptForm').submit((e) => {
        e.preventDefault();
        if ($('#newDept').val() === '' || $('#newDeptBudget').val() === '') return;
        addDepartment();
    })

    $('#newRoleForm').submit((e) => {
        e.preventDefault();
        if ($('#newRoleTitle').val() === '' || $('#newRoleSalary').val() === '') return;
        addRole();
    })

    popDeptDropdowns();
})