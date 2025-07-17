export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert("No data to export.");
      return;
    }
  
    const csvRows = [];
  
    // Get headers
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
  
    // Add rows
    data.forEach(row => {
      const values = headers.map(header => {
        const escaped = String(row[header] || "").replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });
  
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  