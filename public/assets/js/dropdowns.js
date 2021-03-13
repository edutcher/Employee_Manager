function popDeptDropdowns() {
    $('#deptDropdown').addClass('loading');
    $('#deptDrop').empty();
    let newItem = $('<div>').addClass('item').text(`All`);
    newItem.data('id', 1);
    $('#deptDrop').append(newItem);
    axios.get('./api/departments')
        .then(res => {
            currentDepartments = res.data;
            for (let dept of res.data) {
                let newItem = $('<div>').addClass('item').text(`${dept.name}`);
                newItem.data('id', dept.id);
                $('#deptDrop').append(newItem);
            }
            $('#deptDropdown').removeClass('loading');
            $('#deptDropdown')
                .dropdown({
                    onChange: function(value, text, $selectedItem) {
                        if (window.location.pathname === '/departments') $('#delDeptArea').removeClass('hidden').addClass('column');
                        if ($selectedItem.data('id') === 1) {
                            if (window.location.pathname === '/employees') getAllEmployees();
                            if (window.location.pathname === '/departments') $('#delDeptArea').addClass('hidden').removeClass('column');
                        } else getEmpsByDepartment($selectedItem.data('id'));
                        $('#deptChoice').text(`Department: ${text}`);
                        $('#deptChoice').data('id', $selectedItem.data('id'));

                    }
                });
            if (window.location.pathname === '/stats') getAllEmployees();
            if (window.location.pathname === '/departments') popRoleDropdown();

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
                    if (window.location.pathname === '/departments') $('#delRoleArea').removeClass('hidden').addClass('column');
                    $('#roleChoice').text(`Role: ${text}`);
                    $('#roleChoice').data('id', value);
                    if (window.location.pathname === "/employees") popManagerDropdown();
                },
            });
        }).catch(err => {
            console.log(err);
        });
}

async function popManagerDropdown() {
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

    currentManagers = await getManagersByDept(id);
    let managers = [];
    for (let manager of currentManagers) {
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

}