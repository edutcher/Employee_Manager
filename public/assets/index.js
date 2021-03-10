$(document).ready(() => {
    axios.get('./api/employees')
        .then(res => {
            console.log(res);
            for (let emp of res.data) {
                let newRow = $('<tr>');
                let newName = $('<td>').text(`${emp.first_name} ${emp.last_name}`);
                let newRole = $('<td>').text(`${emp.title}`);
                let newSalary = $('<td>').text(`${emp.salary}`);
                let newDpt = $('<td>').text(`${emp.name}`);
                newRow.append(newName, newRole, newSalary, newDpt);
                $('#empTable').append(newRow);
            }
        })
});