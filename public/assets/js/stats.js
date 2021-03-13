var currentDepartments = [];

function getAllEmployees() {
    axios.get('./api/employees')
        .then(res => {
            allGraph(res.data);
        }).catch(err => {
            console.log(err);
        })
}

function getDepartments() {
    axios.get('./api/departments')
        .then(res => {
            currentDepartments = res;
        }).catch(err => {
            console.log(err);
        })
}

function allGraph(data) {
    $('#graph').empty();
    $('#stats').empty();
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
                        $('#deptChoice').data('id', $selectedItem.data('id'));
                        console.log($('#deptChoice').data('id'));
                        $('#deptMenu').addClass('hidden');
                        $('#roleMenu').removeClass('hidden');
                    }
                });
        }).catch(err => {
            console.log(err);
        });
}

$(document).ready(async() => {
    let stop = await popDeptDropdowns();
    getAllEmployees();
})