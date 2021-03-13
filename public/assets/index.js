var currentRoles = [];
var currentManagers = [];
var currentDepartments = [];

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
            $('#delDeptBtn').addClass('ui').removeClass('hidden');
            deptGraph(res.data);
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
            $('#delDeptBtn').addClass('hidden').removeClass('ui');
            allGraph(res.data);
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
            $('#delDeptBtn').addClass('hidden').removeClass('ui');
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
            currentDepartments = res;
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

function allGraph(data) {
    $('#graph').empty();
    let margin = 60;

    let graphData = [];
    let height = 400;
    let width = 700;

    for (let dept of currentDepartments.data) {

        let tempData = data.filter(employee => {
            return dept.name === employee.name
        });
        let salArray = tempData.map(emp => emp.salary);
        let util = salArray.reduce((accu, curr) => accu + curr)
        let tempObj = {
            name: dept.name,
            util: util,
            budget: dept.budget
        }
        graphData.push(tempObj);
    }

    let newList = $('<ul>');

    for (let dept of graphData) {
        let newItem = $('<li>').text(`${dept.name}: ${dept.util} Used of ${dept.budget}`);
        if (dept.util > dept.budget) newItem.css('color', 'red');
        newList.append(newItem);
    }

    $('#stats').append(newList);

    const svg = d3.select("#graph")
        .append('svg')
        .attr('width', 900)
        .attr('height', 600)
        .append("g")
        .attr("transform",
            "translate(" + margin + "," + margin + ")");

    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function(d) { return d.name; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    var y = d3.scaleLinear()
        .domain([0, 300000])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("mybar")
        .data(graphData)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.util); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.util); })
        .attr("fill", (d) => d.util > d.budget ? 'red' : 'navy')

}

function deptGraph(data) {
    console.log(data);
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