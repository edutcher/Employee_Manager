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
        })
}

function addRole() {
    let newRole = {
        title: $('#newRoleTitle').val(),
        salary: $('#newRoleSalary').val(),
        departmentId: $('#deptChoice').data('id')
    }
    axios.post('./api/role', newRole)
        .then(res => {
            if ($('#deptChoice').data('id') === undefined) getAllEmployees();
            else getEmpsByDepartment($('#deptChoice').data('id'));
        })
}

$(document).ready(async() => {

    $('a.item').each(() => {
        $(this).removeClass('active');
    });

    $(`a[href*="${window.location.pathname}"]`).addClass('active');

    $('.ui.dropdown')
        .dropdown({
            allowAdditions: true
        });

    $('#newDeptForm').submit((e) => {
        e.preventDefault();
        if ($('#newDept').val() === '' || $('#newDeptBudget').val() === '') {
            $('#deptErr').removeClass('hidden');
            return;
        }
        $('#deptErr').addClass('hidden');
        addDepartment();
    })

    $('#newRoleForm').submit((e) => {
        e.preventDefault();
        if ($('#newRoleTitle').val() === '' || $('#newRoleSalary').val() === '' || $('#deptChoice').data('id') === undefined) {
            $('#deptErr').removeClass('hidden');
            return;
        }
        $('#deptErr').addClass('hidden');
        addRole();
    })

    popDeptDropdowns();
})