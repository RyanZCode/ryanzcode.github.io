/**
 * This file contains scripts used to get and add data to the work
 * order tracking web app.
 * @author Ryan Zhou
 */

/**
 * Adds all quality data to display
 */
async function addQualityData() {
    let data = await getData();
    addQualityTable();
    const table = createQualityTable(data);
    addQualityRows(data, table);
    table.draw(false);
    table.searchPanes.rebuildPane(0, true);
    table.searchPanes.rebuildPane(1, true);
    table.searchPanes.rebuildPane(5, true);
    addTimestamp(data[0], "#timestampContainer");
}

/**
 * Gets and parses quality data from .csv file
 * @returns {Object} - parsed quality data
 */
async function getData() {
    const response = await fetch("http://192.168.1.75/data/wo_data.csv");
    return Papa.parse(await response.text(), { header: true }).data;
}

/**
 * Creates a DataTable object for the quality data
 * @param {Object} data - parsed quality data
 * @returns {Object} - DataTable object
 */
function createQualityTable(data) {
    filters = [];
    min = Math.floor(data[0].wo_num / 1000) * 1000;
    max = Math.floor(data[data.length - 2].wo_num / 1000) * 1000;
    for (let i = min; i <= max; i += 1000) {
        filters.push({ label: i, value: function (rowData, rowIdx) { return rowData[0] >= i && rowData[0] < i + 1000; }});
    }
    yearFilters = [];
    yearFilters.push({ label: "No Completion Confirmation", value: function (rowData, rowIdx) { return rowData[5] === "No Completion Confirmation"; }});
    for (let i = 2019; i <= 2024; i++) {
        yearFilters.push({ label: i, value: function (rowData, rowIdx) { return rowData[5].includes(i); }});
    }
    const table = new DataTable('#qualityTable', {
        autoWidth: false,
        colReorder: true,
        select: true,
        columnDefs: [
            {
                targets: '_all',
                className: 'dt-body-left dt-head-left'
            },
            {
                searchPanes: {
                    header: 'Work Order Range',
                    show: true,
                    options: filters
                },
                targets: [0]
            },
            {
                searchPanes: {
                    header: 'Status',
                    show: true,
                    options: [
                        {
                            label: 'In Quality',
                            value: function (rowData, rowIdx) {
                                return rowData[1] === "In Quality"; 
                            }
                        },
                        {
                            label: 'Tentative',
                            value: function (rowData, rowIdx) {
                                return rowData[1] === "Tentative"; 
                            }
                        }
                    ]
                },
                targets: [1]
            },
            {
                searchPanes: {
                    header: 'Completion Confirmation Year',
                    show: true,
                    options: yearFilters
                },
                targets: [5]
            },
            {
                targets: [6],
                render: function (data, type, row) {
                    if (type === 'sort') {
                        return eval(data);
                    }
                    return data;
                }
            }
        ],
        createdRow: function (row, data, dataIndex) {
            if (data[1] === "In Quality") {
                $(row).addClass('confident');
            } else {
                $(row).addClass('tentative');
            }
        },
        layout: {
            topStart: {
                buttons: [
                    'pageLength', 'copy', 'excel', 'pdf', 'print'
                ]
            },
            top1: {
                searchPanes: {
                    layout: 'columns-3',
                    columns: [0, 1, 5]
                }
            },
            topEnd: 'search',
            bottomStart: 'info',
            bottomEnd: 'paging'
        },
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"]
        ],
        pageLength: -1
    });
    return table;
}

/**
 * Adds a table to display quality data
 */
function addQualityTable() {
    colNames = '<th>Work Order</th> <th>Status</th> <th>Part Number</th> <th>Description</th> <th>Qty in Quality</th> <th>Quality Completion Confirmation Date</th> <th>Work Order Entry Number</th>'
    $("#tableContainer").append('<table class="display compact cell-border" id="qualityTable"><thead> <tr>' + colNames + '</tr> </thead></table></container>');
}

/**
 * Populates the quality table with quality data
 * @param {Object} data - parsed quality data
 * @param {Object} table - DataTable object
 */
function addQualityRows(data, table) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].in_quality === "2") {
            addToQualityLocation(data[i], table, "In Quality");
        } else if (data[i].in_quality === "1") {
            addToQualityLocation(data[i], table, "Tentative");
        }
    }
}

/**
 * Adds a row to the quality table
 * @param {Object} data - parsed quality data
 * @param {Object} table - DataTable object
 * @param {String} className - class name for row
 */
function addToQualityLocation(data, table, className) {
    if (data.wo_num === "") {
        return;
    } else {
        table.row.add([data.wo_num, className, data.part_num, data.description, data.qty, data.date, data.progress]);
    }
}

/**
 * Adds a timestamp to the page
 * @param {Object} data - parsed quality data
 * @param {String} location - location to add to
 */
function addTimestamp(data, location) {
    // Remove past timestamp
    $("#timestamp").remove();

    // Add new timestamp
    $(location).append('<div id="timestamp" class="me-auto ms-auto fs-4">Last updated: ' + data.timestamp + '</div>');
}

/**
 * Adds all MRB data to display
 */
async function addMRBData() {
    let data = await getData();
    addMRBTable();
    const table = createMRBTable(data);
    addMRBRows(data, table);
    table.draw(false);
    table.searchPanes.rebuildPane(0, true);
    table.searchPanes.rebuildPane(4, true);
    addTimestamp(data[0], "#timestampContainer");
}

/**
 * Creates a DataTable object for the MRB data
 * @param {Object} data - parsed MRB data
 * @returns {Object} - DataTable object
 */
function createMRBTable(data) {
    filters = [];
    min = Math.floor(data[0].wo_num / 1000) * 1000;
    max = Math.floor(data[data.length - 2].wo_num / 1000) * 1000;
    for (let i = min; i <= max; i += 1000) {
        filters.push({ label: i, value: function (rowData, rowIdx) { return rowData[0] >= i && rowData[0] < i + 1000; }});
    }
    yearFilters = [];
    yearFilters.push({ label: "No Completion Confirmation", value: function (rowData, rowIdx) { return rowData[4] === "No Completion Confirmation"; }});
    for (let i = 2019; i <= 2024; i++) {
        yearFilters.push({ label: i, value: function (rowData, rowIdx) { return rowData[4].includes(i); }});
    }
    const table = new DataTable('#qualityTable', {
        autoWidth: false,
        colReorder: true,
        select: true,
        columnDefs: [
            {
                targets: '_all',
                className: 'dt-body-left dt-head-left'
            },
            {
                searchPanes: {
                    header: 'Work Order Range',
                    show: true,
                    options: filters
                },
                targets: [0]
            },
            {
                searchPanes: {
                    header: 'Completion Confirmation Year',
                    show: true,
                    options: yearFilters
                },
                targets: [4]
            }
        ],
        createdRow: function (row, data, dataIndex) {
            $(row).addClass('confident');
        },
        layout: {
            topStart: {
                buttons: [
                    'pageLength', 'copy', 'excel', 'pdf', 'print'
                ]
            },
            top1: {
                searchPanes: {
                    layout: 'columns-2',
                    columns: [0, 4]
                }
            },
            topEnd: 'search',
            bottomStart: 'info',
            bottomEnd: 'paging'
        },
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"]
        ],
        pageLength: -1
    });
    return table;
}

/**
 * Adds a table to display MRB data
 */
function addMRBTable() {
    colNames = '<th>Work Order</th> <th>Part Number</th> <th>Description</th> <th>Qty in MRB</th> <th>Latest MRB Completion Confirmation Date</th>'
    $("#tableContainer").append('<table class="display compact cell-border" id="qualityTable"><thead> <tr>' + colNames + '</tr> </thead></table></container>');
}

/**
 * Populates the MRB table with MRB data
 * @param {Object} data - parsed MRB data
 * @param {Object} table - DataTable object
 */
function addMRBRows(data, table) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].mrb === "True") {
            addToMRBLocation(data[i], table);
        }
    }
}

/**
 * Adds a row to the MRB table
 * @param {Object} data - parsed MRB data
 * @param {Object} table - DataTable object
 * @returns 
 */
function addToMRBLocation(data, table) {
    if (data.wo_num === "") {
        return;
    } else {
        let date = new Date(data.mrb_date).toISOString().slice(0, -14);
        table.row.add([data.wo_num, data.part_num, data.description, data.mrb_qty, date]);
    }
}