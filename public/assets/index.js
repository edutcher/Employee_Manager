$(document).ready(() => {
    axios.get('./api/employees')
        .then(res => {
            console.log(res);
            for (let emp of res.data) {
                let newRow = $('<tr>');
                let newName = $('<td>').text(`${emp.first_name} ${emp.last_name}`);
                let newRole = $('<td>').text(`${emp.role_id}`);
                newRow.append(newName, newRole);
                $('#empTable').append(newRow);
            }
        })
});