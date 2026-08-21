/**
 * Excel / CSV Exporter Utility for Admin Data Sheets
 */
export function exportToCsv(filename, rows, headers) {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = Object.keys(rows[0]);

  const headerRow = (headers && headers.length ? headers : keys)
    .map(h => `"${String(h).replace(/"/g, '""')}"`)
    .join(separator);

  const csvRows = rows.map(row => {
    return keys
      .map(k => {
        let val = row[k] === null || row[k] === undefined ? '' : row[k];
        if (typeof val === 'object') val = JSON.stringify(val);
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(separator);
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headerRow, ...csvRows].join('\r\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename || 'export'}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function copyTableToClipboard(rows, headers) {
  if (!rows || !rows.length) return false;
  const keys = Object.keys(rows[0]);
  const headerRow = (headers && headers.length ? headers : keys).join('\t');
  const dataRows = rows.map(r => keys.map(k => String(r[k] || '')).join('\t')).join('\n');
  const fullText = headerRow + '\n' + dataRows;
  navigator.clipboard.writeText(fullText);
  return true;
}
