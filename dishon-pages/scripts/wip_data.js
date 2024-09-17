/**
 * This file contains scripts used to get and add data to the WIP 
 * report web app.
 * @author Ryan Zhou
 */


async function addWIPData() {
    let data = await getData();
    addWIPTable();
    const table = createWIPTable(data);
    addWIPRows(data, table);
    table.draw(false);
    table.searchPanes.rebuildPane(0, true);
    table.searchPanes.rebuildPane(1, true);
    table.searchPanes.rebuildPane(3, true);
    table.searchPanes.rebuildPane(4, true);
    addTimestamp(data[0], "#timestampContainer");
}

/**
 * Gets and parses WIP data from .csv file
 * @returns {Object} - parsed WIP data
 */
async function getData() {
    const response = await fetch("http://192.168.1.75/data/wip_data.csv");
    return Papa.parse(await response.text(), { header: true }).data;
}

/**
 * Creates a DataTable object for the WIP data
 * @param {Object} data - parsed WIP data
 * @returns {Object} - DataTable object
 */
function createWIPTable(data) {
    filters = [];
    min = Math.floor(data[0].wo_num / 1000) * 1000;
    max = Math.floor(data[data.length - 2].wo_num / 1000) * 1000;
    for (let i = min; i <= max; i += 1000) {
        filters.push({ label: i, value: function (rowData, rowIdx) { return rowData[0] >= i && rowData[0] < i + 1000; }});
    }
    partFilters = [];
    part_nums = [];
    for (let i = 0; i <= data.length - 2; i++) {
        if (!part_nums.includes(data[i].part_num)) {
            part_nums.push(data[i].part_num);
            partFilters.push({ label: data[i].part_num, value: function (rowData, rowIdx) { return rowData[1] === data[i].part_num; }});
        }
    }
    customerFilters = [];
    customers = [];
    for (let i = 0; i <= data.length - 2; i++) {
        if (!customers.includes(data[i].customer)) {
            customers.push(data[i].customer);
            customerFilters.push({ label: data[i].customer, value: function (rowData, rowIdx) { return rowData[3] === data[i].customer; }});
        }
    }
    outstandingQtyFilters = [];
    outstandingQty = [];
    for (let i = 0; i <= data.length - 2; i++) {
        if (!outstandingQty.includes(data[i].qty_tbr)) {
            outstandingQty.push(data[i].qty_tbr);
            outstandingQtyFilters.push({ label: data[i].qty_tbr, value: function (rowData, rowIdx) { return Number(rowData[4].replace(",", "")) > Number(data[i].qty_tbr.replace(",", "")); }});
        }
    }
    const table = new DataTable('#WIPTable', {
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
                    header: 'Part Number',
                    show: true,
                    options: partFilters
                },
                targets: [1]
            },
            {
                searchPanes: {
                    header: 'Customer',
                    show: true,
                    options: customerFilters
                },
                targets: [3]
            },
            {
                searchPanes: {
                    header: 'Outstanding Qty Greater Than',
                    show: true,
                    options: outstandingQtyFilters
                },
                targets: [4]
            }
            // ,
            // {
            //     targets: [6],
            //     render: function (data, type, row) {
            //         if (type === 'sort') {
            //             return eval(data);
            //         }
            //         return data;
            //     }
            // }
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
                    layout: 'columns-4',
                    columns: [0, 1, 3, 4]
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
 * Adds a table to display WIP data
 */
function addWIPTable() {
    // colNames = '<th>Work Order</th> <th>Part Number</th> <th>Description</th> <th>Customer</th> <th>Outstanding Qty</th> <th>Yield Qty</th> <th>MRB Qty</th> <th>Scrap Qty</th> <th>Qty Due</th>'
    colNames = '<th>Work Order</th> <th>Part Number</th> <th>Description</th> <th>Customer</th> <th>Outstanding Qty</th> <th>Yield Qty</th> <th>Qty Due</th>'
    $("#tableContainer").append('<table class="display compact cell-border" id="WIPTable"><thead> <tr>' + colNames + '</tr> </thead></table></container>');
}

/**
 * Populates the WIP table with WIP data
 * @param {Object} data - parsed WIP data
 * @param {Object} table - DataTable object
 */
function addWIPRows(data, table) {
    for (let i = 0; i < data.length; i++) {
        addToWIPLocation(data[i], table, "");
    }
}

/**
 * Adds a row to the WIP table
 * @param {Object} data - parsed WIP data
 * @param {Object} table - DataTable object
 * @param {String} className - class name for row
 */
function addToWIPLocation(data, table, className) {
    if (data.wo_num === "") {
        return;
    } else {
        // table.row.add([data.wo_num, data.part_num, data.description, data.customer, data.qty_tbr, data.yield, data.mrb, data.scrap, data.due]);
        table.row.add([data.wo_num, data.part_num, data.description, data.customer, data.qty_tbr, data.yield, data.due]);
    }
}

/**
 * Adds a timestamp to the page
 * @param {Object} data - parsed WIP data
 * @param {String} location - location to add to
 */
function addTimestamp(data, location) {
    // Remove past timestamp
    $("#timestamp").remove();

    // Add new timestamp
    $(location).append('<div id="timestamp" class="me-auto ms-auto fs-4">Last updated: ' + data.timestamp + '</div>');
}