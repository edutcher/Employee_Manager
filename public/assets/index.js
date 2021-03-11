function addEmpToTable(emp) {
    let newRow = $('<tr>');
    let newName = $('<td>').text(`${emp.first_name} ${emp.last_name}`);
    let newRole = $('<td>').text(`${emp.title}`);
    let newSalary = $('<td>').text(`${emp.salary}`);
    let newDpt = $('<td>').text(`${emp.name}`);
    newRow.append(newName, newRole, newSalary, newDpt);
    $('#empTable').append(newRow);
}

function getEmpsByDepartment(id) {
    $('#empTable').empty();
    axios.get(`./api/department/${id}`)
        .then(res => {
            for (let emp of res.data) {
                addEmpToTable(emp);
            }
        })
}

function getAllEmployees() {
    $('#empTable').empty();
    axios.get('./api/employees')
        .then(res => {
            for (let emp of res.data) {
                addEmpToTable(emp);
            }
        })
}

function empSearch(first, last) {
    $('#empTable').empty();
    axios.post('./api/employee/search', { firstName: first, lastName: last })
        .then(res => {
            for (let emp of res.data) {
                addEmpToTable(emp);
            }
        })
}

function popDropdowns() {
    $('#dptDropdown').addClass('loading');
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
            $('#dptDropdown').removeClass('loading');
            $('#dptDropdown').dropdown();
            $('.dropdown')
                .dropdown({
                    onChange: function(value, text, $selectedItem) {
                        if ($selectedItem.data('id') === 1) getAllEmployees();
                        else getEmpsByDepartment($selectedItem.data('id'));
                    }
                });
        });
}

$(document).ready(() => {

    $('form').submit((e) => {
        e.preventDefault();
        if ($('#firstName').val() != '' || $('#lastName').val() != '') {
            empSearch($('#firstName').val(), $('#lastName').val());
        }
    })

    $('.dropdown')
        .dropdown({
            onChange: function(value, text, $selectedItem) {
                if ($selectedItem.data('id') === 1) getAllEmployees();
                else getEmpsByDepartment($selectedItem.data('id'));
            }
        });

    getAllEmployees();
    popDropdowns();
});