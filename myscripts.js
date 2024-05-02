document.getElementById("locationFilter").addEventListener("change", function() {
    filterJobs();
});

document.getElementById("experienceFilter").addEventListener("change", function() {
    filterJobs();
});

document.getElementById("industryFilter").addEventListener("change", function() {
    filterJobs();
});

document.getElementById("functionFilter").addEventListener("change", function() {
    filterJobs();
});

document.getElementById("sectorFilter").addEventListener("change", function() {
    filterJobs();
});

document.getElementById("cityFilter").addEventListener("input", function() {
    filterJobsByCity();
});


function filterJobs() {
    var selectedLocation = document.getElementById("locationFilter").value;
    var selectedExperience = document.getElementById("experienceFilter").value;
    var selectedIndustry = document.getElementById("industryFilter").value;
    var selectedFunction = document.getElementById("functionFilter").value;
    var selectedSector = document.getElementById("sectorFilter").value;
    var tableRows = document.querySelectorAll("#jobTable tbody tr");

    tableRows.forEach(function(row) {
        var locationCell = row.querySelector(".location");
        var experienceCell = row.querySelector(".experience");
        var industryCell = row.querySelector(".Industry");
        var functionCell = row.querySelector(".function");
        var cityCell = row.querySelector(".City");
        var sectorData = row.dataset.sector.split(","); // Get sector data from dataset
        var industryData = row.dataset.industry.split(","); // Get industry data from dataset
        var stateData = row.dataset.state.split(","); // Split state data
        var functionData = row.dataset.jobFunction;

        var experienceData = experienceCell.dataset.experience.split(","); // Split experience levels

        var showRow = false;

        experienceData.forEach(function(exp) {
            if (exp.trim() === selectedExperience || selectedExperience === "all") {
                showRow = true;
            }
        });

        // Check if selected state is included in the list of states
        if ((selectedLocation === "all" || stateData.includes(selectedLocation)) &&
            (selectedFunction === "all" || functionData.includes(selectedFunction)) &&
            (selectedIndustry === "all" || industryData.includes(selectedIndustry)) && // Check if selected industry is in industry data
            (selectedSector === "all" || sectorData.includes(selectedSector)) && // Check if selected sector is in sector data
            showRow) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });
}

function filterJobsByCity() {
    var input = document.getElementById("cityFilter").value.trim().toLowerCase();
    var tableRows = document.querySelectorAll("#jobTable tbody tr");

    tableRows.forEach(function(row) {
        var cityCell = row.querySelector(".City");
        var cities = row.dataset.city.split(','); // Split city data

        var showRow = false;

        cities.forEach(function(city) {
            if (city.trim().toLowerCase().includes(input)) { // Check if the input is included in any city
                showRow = true;
            }
        });

        if (showRow) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });
}

document.getElementById("click").addEventListener("change", function() {
    toggleTableVisibility();
});

function toggleTableVisibility() {
    var tableCells = document.querySelectorAll("td, th");

    tableCells.forEach(function(cell) {
        cell.classList.toggle('hidden');
    });
}

// Search job by job id 
document.getElementById("jobIdFilter").addEventListener("input", function() {
    filterJobsById();
});

function filterJobsById() {
    var input = document.getElementById("jobIdFilter").value.toLowerCase();
    var tableRows = document.querySelectorAll("#jobTable tbody tr");

    tableRows.forEach(function(row) {
        var jobIdCell = row.querySelector(".job-id");
        var jobId = jobIdCell.textContent.toLowerCase();

        if (jobId.indexOf(input) > -1) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });
}
// below is realted to new feature
document.addEventListener("DOMContentLoaded", function() {
    // Variables for pagination
    var currentPage = 1;
    var jobsPerPage = parseInt(document.getElementById("jobsPerPage").value);
    var totalJobs = document.querySelectorAll("#jobTable tbody tr").length;
    var totalPages = Math.ceil(totalJobs / jobsPerPage);

    // Update pagination info
    function updatePagination() {
        totalPages = Math.ceil(totalJobs / jobsPerPage);
        document.getElementById("currentPage").textContent = "Page " + currentPage + " of " + totalPages;
    }

    // Update table visibility based on pagination
    function updateTableVisibility() {
        var tableRows = document.querySelectorAll("#jobTable tbody tr");

        tableRows.forEach(function(row, index) {
            if (jobsPerPage === 'all' || (index >= (currentPage - 1) * jobsPerPage && index < currentPage * jobsPerPage)) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    }

    // Initial setup
    updateTableVisibility();
    updatePagination();

    // Event listeners for dropdown and pagination buttons
    document.getElementById("jobsPerPage").addEventListener("change", function() {
        jobsPerPage = this.value === 'all' ? 'all' : parseInt(this.value);
        currentPage = 1;
        updatePagination();
        updateTableVisibility();
    });

    document.getElementById("prevPage").addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            updateTableVisibility();
        }
    });

    document.getElementById("nextPage").addEventListener("click", function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            updateTableVisibility();
        }
    });
});
