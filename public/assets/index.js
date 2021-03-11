function addEmpToTable(emp) {
    let newRow = $('<tr>');
    let newName = $('<td>').text(`${emp.first_name} ${emp.last_name}`);
    let newRole = $('<td>').text(`${emp.title}`);
    let newSalary = $('<td>').text(`${emp.salary}`);
    let newDpt = $('<td>').text(`${emp.name}`);
    newRow.append(newName, newRole, newSalary, newDpt);
    $('#empTable').append(newRow);
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

$(document).ready(() => {

    $('form').submit((e) => {
        e.preventDefault();
        if ($('#firstName').val() != '' || $('#lastName').val() != '') {
            empSearch($('#firstName').val(), $('#lastName').val());
        }
    })

    getAllEmployees();
});