/**
 * This file contains scripts used to get and add data to the machine
 * monitoring web app.
 * @author Ryan Zhou
 */

/**
 * Gets and parses machine status data from .csv file
 * @returns {Object} - parsed machine status data
 */
async function getStatuses() {
    statusData = await fetch("https://ryanzcode.github.io/dishon-pages/data/machine_statuses.csv");
    return Papa.parse(await statusData.text(), {header: true}).data;
}

/**
 * Gets and adds all machine status data to proper containers.
 */
async function getAllStatus() {
    addAllData(await getStatuses());
}

/**
 * Gets and adds Lathes/Millturn machine status data to proper containers.
 */
async function getLaMiStatus() {
    addLaMiData(await getStatuses());
}

/**
 * Gets and adds Mill4/5sax machine status data to proper containers.
 */
async function getM45SaxStatus() {
    addM45SaxData(await getStatuses());
}

/**
 * Gets and adds Grinding machine status data to proper containers.
 */
async function getGrindingStatus() {
    addGrindingData(await getStatuses());
}

/**
 * Adds all machine status data to proper containers.
 * @param {Object} statusData - .csv file containing all machine status data.
 */
function addAllData(statusData) {
    // Remove all previous data from page before adding new data
    $(".col-md").remove();
    // Loop through data, adding each entry to its respective category
    for (let i = 0; i < statusData.length; i++) {
        if (statusData[i].machine_category === "Lathes") {
            addMachine(statusData[i], "#lathes");
        } else if (statusData[i].machine_category === "Millturn") {
            addMachine(statusData[i], "#millturn");
        } if (statusData[i].machine_category === "Mill4ax") {
            addMachine(statusData[i], "#mill4ax");
        } else if (statusData[i].machine_category === "Mill5ax") {
            addMachine(statusData[i], "#mill5ax");
        } else if (statusData[i].machine_category === "Grinding") {
            addMachine(statusData[i], "#grinding");
        }
    }
    // Add timestamp
    addTimestamp(statusData[0], "#timestamp");
}

/**
 * Adds Lathes/Millturn machine status data to proper containers.
 * @param {Object} statusData - parsed .csv file containing all machine status data.
 */
function addLaMiData(statusData) {
    // Remove all previous data from page before adding new data
    $(".col-md").remove();
    // Loop through data, adding each entry to its respective category
    for (let i = 0; i < statusData.length; i++) {
        if (statusData[i].machine_category === "Lathes") {
            addMachine(statusData[i], "#lathes");
        } else if (statusData[i].machine_category === "Millturn") {
            addMachine(statusData[i], "#millturn");
        }
    }
    // Add timestamp
    addTimestamp(statusData[0], "#timestamp");
}

/**
 * Adds Mill4/5sax machine status data to proper containers.
 * @param {Object} statusData - parsed .csv file containing all machine status data.
 */
function addM45SaxData(statusData) {
    // Remove all previous data from page before adding new data
    $(".col-md").remove();
    // Loop through data, adding each entry to its respective category
    for (let i = 0; i < statusData.length; i++) {
        if (statusData[i].machine_category === "Mill4ax") {
            addMachine(statusData[i], "#mill4ax");
        } else if (statusData[i].machine_category === "Mill5ax") {
            addMachine(statusData[i], "#mill5ax");
        }
    }
    // Add timestamp
    addTimestamp(statusData[0], "#timestamp");
}

/**
 * Adds Grinding machine status data to proper containers.
 * @param {Object} statusData - parsed .csv file containing all machine status data.
 */
function addGrindingData(statusData) {
    // Remove all previous data from page before adding new data
    $(".col-md").remove();
    // Loop through data, adding each entry to its respective category
    for (let i = 0; i < statusData.length; i++) {
        if (statusData[i].machine_category === "Grinding") {
            addMachine(statusData[i], "#grinding");
        }
    }
    // Add timestamp
    addTimestamp(statusData[0], "#timestamp");
}

/**
 * Adds machine data to specific location.
 * @param {Object} machine - machine data.
 * @param {string} location - location to add to.
 */
function addMachine(machine, location) {
    if (machine.device_name == "") { // No name
        return;
    } else if (machine.power_status == 2) { // On
        $(location).append('<div class="col-md border border-dark fs-3 text-center machine-on">' +
            machine.device_name + "<br>" + machine.uptime_percent + '%</div>');
    } else if (machine.power_status == 1) { // Idle
        $(location).append('<div class="col-md border border-dark fs-3 text-center machine-idle">' +
            machine.device_name + "<br>" + machine.uptime_percent + '%</div>');
    } else { // Off
        $(location).append('<div class="col-md border border-dark fs-3 text-center machine-off">' +
            machine.device_name + "<br>" + machine.uptime_percent + '%</div>');
    }
}

/**
 * Adds a timestamp to specific location.
 * @param {Object} machine - machine data.
 * @param {string} location - location to add to.
 */
function addTimestamp(machine, location) {
    // Remove past timestamp
    $("#current-time").remove();
    // Add new timestamp
    $(location).append('<div id="current-time" class="me-auto ms-auto fs-4">Last updated: ' + machine.timestamp + '</div>');
}