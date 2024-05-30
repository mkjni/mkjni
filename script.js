const jobDescriptionCache = {};

async function fetchJobDescription(url) {
    if (jobDescriptionCache[url]) {
        return jobDescriptionCache[url];
    }

    try {
        let response = await fetch(url);
        let text = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(text, 'text/html');
        let bodyContainer = doc.querySelector('body');  // Changed from '.bodycontainer' to 'body' to handle external pages.
        let description = bodyContainer ? bodyContainer.textContent.toLowerCase() : '';
        jobDescriptionCache[url] = description;
        return description;
    } catch (error) {
        console.error('Error fetching job description:', error);
        return '';
    }
}

async function prefetchAllJobDescriptions() {
    let tableRows = document.querySelectorAll("#jobTable tbody tr");
    let jobs = [];

    for (let row of tableRows) {
        let jobDescriptionUrl = row.getAttribute("onclick").match(/'(.*?)'/)[1];
        let description = await fetchJobDescription(jobDescriptionUrl);
        let job = {
            id: row.querySelector(".job-id").textContent.trim(),
            title: row.querySelector(".job-title").textContent.trim(),
            description: description,
            element: row
        };
        jobs.push(job);
    }
    return jobs;
}

async function filterJobs() {
    let keywordFilter = document.getElementById("keywordFilter").value.toLowerCase();
    let jobIdFilter = document.getElementById("jobIdFilter").value.toLowerCase();
    let locationFilter = document.getElementById("locationFilter").value.toLowerCase();
    let experienceFilter = document.getElementById("experienceFilter").value;
    
    let tableRows = document.querySelectorAll("#jobTable tbody tr");

    for (let row of tableRows) {
        let jobDescriptionUrl = row.getAttribute("onclick").match(/'(.*?)'/)[1];
        let description = await fetchJobDescription(jobDescriptionUrl);
        let rowText = row.textContent.toLowerCase();
        let jobId = row.querySelector(".job-id").textContent.toLowerCase();
        let location = row.querySelector(".location").textContent.toLowerCase();
        let experience = row.querySelector(".experience").getAttribute("data-experience").split(', ');

        let matchesKeyword = keywordFilter === '' || rowText.includes(keywordFilter) || description.includes(keywordFilter);
        let matchesJobId = jobIdFilter === '' || jobId.includes(jobIdFilter);
        let matchesLocation = locationFilter === 'all' || location.includes(locationFilter);
        let matchesExperience = experienceFilter === 'all' || experience.includes(experienceFilter);

        if (matchesKeyword && matchesJobId && matchesLocation && matchesExperience) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    }

    updatePagination();
}

function updatePagination() {
    let jobsPerPage = document.getElementById("jobsPerPage").value === 'all' ? 'all' : parseInt(document.getElementById("jobsPerPage").value);
    let tableRows = document.querySelectorAll("#jobTable tbody tr:not(.hidden)");
    let currentPage = parseInt(document.getElementById("currentPage").textContent.split(" ")[1]);
    let totalJobs = tableRows.length;
    let totalPages = jobsPerPage === 'all' ? 1 : Math.ceil(totalJobs / jobsPerPage);

    document.getElementById("currentPage").textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;

    tableRows.forEach((row, index) => {
        if (jobsPerPage === 'all' || (index >= (currentPage - 1) * jobsPerPage && index < currentPage * jobsPerPage)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

document.getElementById("prevPage").addEventListener("click", () => {
    let currentPage = parseInt(document.getElementById("currentPage").textContent.split(" ")[1]);
    if (currentPage > 1) {
        currentPage--;
        document.getElementById("currentPage").textContent = `Page ${currentPage}`;
        updatePagination();
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    let currentPage = parseInt(document.getElementById("currentPage").textContent.split(" ")[1]);
    let totalPages = parseInt(document.getElementById("currentPage").textContent.split(" ")[3]);
    if (currentPage < totalPages) {
        currentPage++;
        document.getElementById("currentPage").textContent = `Page ${currentPage}`;
        updatePagination();
    }
});

document.getElementById("jobsPerPage").addEventListener("change", () => {
    document.getElementById("currentPage").textContent = "Page 1";
    updatePagination();
});

document.getElementById("keywordFilter").addEventListener("input", filterJobs);
document.getElementById("jobIdFilter").addEventListener("input", filterJobs);
document.getElementById("locationFilter").addEventListener("change", filterJobs);
document.getElementById("experienceFilter").addEventListener("change", filterJobs);

document.addEventListener("DOMContentLoaded", async function() {
    await prefetchAllJobDescriptions();
    filterJobs();
});
