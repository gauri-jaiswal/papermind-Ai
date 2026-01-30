function bytesToMB(bytes) {
  if (bytes === 0) {
    return 0; // Handle the case of 0 bytes
  }
  const megabytes = bytes / (1024 * 1024);
  return megabytes;
}

function formatIsoDate(value) {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value ?? "");
    return d.toLocaleString();
  } catch {
    return String(value ?? "");
  }
}

export {
    bytesToMB
    ,formatIsoDate
}