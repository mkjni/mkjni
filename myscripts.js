<script>
document.getElementById("locationFilter").addEventListener("change", filterJobs);
document.getElementById("experienceFilter").addEventListener("change", filterJobs);
document.getElementById("jobIdFilter").addEventListener("input", filterJobsById);
document.getElementById("keywordInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addKeyword(this.value);
        this.value = "";
    }
});

function addKeyword(keyword) {
    if (keyword.trim() === "") return;

    var keywordContainer = document.getElementById("keywordContainer");
    var keywordDiv = document.createElement("div");
    keywordDiv.className = "keyword-div";
    keywordDiv.textContent = keyword + " ";

    var removeButton = document.createElement("span");
    removeButton.className = "remove-keyword";
    removeButton.textContent = "✖";
    removeButton.addEventListener("click", function() {
        keywordContainer.removeChild(keywordDiv);
        filterJobs();
    });

    keywordDiv.appendChild(removeButton);
    keywordContainer.appendChild(keywordDiv);

    filterJobs();
}

async function filterJobs() {
    var selectedLocation = document.getElementById("locationFilter").value.toUpperCase();
    var selectedExperience = document.getElementById("experienceFilter").value;
    var keywords = Array.from(document.getElementById("keywordContainer").children).map(function(div) {
        return div.textContent.slice(0, -2).toLowerCase();
    });

    var tableRows = document.querySelectorAll("#jobTable tbody tr");

    for (let row of tableRows) {
        var locationCell = row.querySelector(".location");
        var experienceCell = row.querySelector(".experience");
        var stateData = locationCell.textContent.trim().toUpperCase();
        var experienceData = experienceCell.dataset.experience.split(",");

        var matchesKeywords = true;

        if (keywords.length > 0) {
            matchesKeywords = await keywords.every(async function(keyword) {
                var jobDescriptionURL = row.querySelector(".job-id").textContent.trim();
                var rowText = row.textContent.toLowerCase();
                return rowText.includes(keyword) || await searchJobDescription(jobDescriptionURL, keyword);
            });
        }

        var showRow = experienceData.some(function(exp) {
            return exp.trim() === selectedExperience || selectedExperience === "all";
        });

        var locationMatch = (selectedLocation === "ALL" || stateData === selectedLocation);

        if (locationMatch && showRow && matchesKeywords) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    }

    updatePagination(); // Update pagination after filtering
}

async function searchJobDescription(jobId, keyword) {
    var url = `https://www.jobnexusindia.com/jd/${jobId}.html`;

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        let text = await response.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, "text/html");
        var bodyContainer = doc.querySelector(".bodycontainer");
        if (bodyContainer && bodyContainer.textContent.toLowerCase().includes(keyword)) {
            return true;
        }
    } catch (error) {
        console.error("Error fetching job description:", error);
    }
    return false;
}

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

    updatePagination(); // Update pagination after filtering
}

document.addEventListener("DOMContentLoaded", function() {
    var currentPage = 1;
    var jobsPerPage = parseInt(document.getElementById("jobsPerPage").value);

    function updatePagination() {
        var tableRows = document.querySelectorAll("#jobTable tbody tr");
        var visibleRows = Array.from(tableRows).filter(function(row) {
            return !row.classList.contains('hidden');
        });

        var totalJobs = visibleRows.length;
        var totalPages = jobsPerPage === 'all' ? 1 : Math.ceil(totalJobs / jobsPerPage);

        if (jobsPerPage === 'all') {
            document.getElementById("currentPage").textContent = "Showing all jobs";
        } else {
            document.getElementById("currentPage").textContent = "Page " + currentPage + " of " + totalPages;
        }

        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled = currentPage === totalPages;

        updateTableVisibility(visibleRows, totalJobs, totalPages);
    }

    function updateTableVisibility(visibleRows, totalJobs, totalPages) {
        visibleRows.forEach(function(row, index) {
            if (jobsPerPage === 'all' || (index >= (currentPage - 1) * jobsPerPage && index < currentPage * jobsPerPage)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    document.getElementById("jobsPerPage").addEventListener("change", function() {
        jobsPerPage = this.value === 'all' ? 'all' : parseInt(this.value);
        currentPage = 1;
        updatePagination();
    });

    document.getElementById("prevPage").addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });

    document.getElementById("nextPage").addEventListener("click", function() {
        var tableRows = document.querySelectorAll("#jobTable tbody tr");
        var visibleRows = Array.from(tableRows).filter(function(row) {
            return !row.classList.contains('hidden');
        });

        var totalJobs = visibleRows.length;
        var totalPages = jobsPerPage === 'all' ? 1 : Math.ceil(totalJobs / jobsPerPage);

        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });

    updatePagination();
});
</script>
