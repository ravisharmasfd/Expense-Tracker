// Get the download button element
const downloadBtn = document.getElementById('download-btn');
// Get the authorization token from local storage
const token = localStorage.getItem('token');

// Add a click event listener to the download button
downloadBtn.addEventListener('click', async () => {
  try {
       
    // Send a request to the API to download the report
    const response = await axios.get('/api/expense/download-report', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Create a new link element to download the file
    const downloadLink = document.createElement('a');
    downloadLink.href = response.data.url;
    downloadLink.download = 'expenses.txt';
    
    // Click the link to download the file
    downloadLink.click();
    
    // Get the previous reports data from the API
    
  } catch (error) {
    console.error(error);
    
  }
});


window.addEventListener('DOMContentLoaded',async()=>{
  try {
    const previousReports = await axios.get('/api/expense/download-previous', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Get the table element for the previous reports
    const previousReportsTable = document.getElementById('previous-reports').querySelector('tbody');
    
    // Clear the previous reports table
    previousReportsTable.innerHTML = '';
    
    // Add a row for each previous report to the table
    previousReports.data.forEach(file => {
      const row = previousReportsTable.insertRow();
      const dateCell = row.insertCell();
      const linkCell = row.insertCell();
      const downloadLink = document.createElement('a');
      downloadLink.href = file.url;
      downloadLink.textContent = 'Download';
      linkCell.appendChild(downloadLink);
      dateCell.textContent = file.createdAt;
    });
  } catch (error) {
    alert("You are not a premium member");
    window.location.href = "/"
  }
})