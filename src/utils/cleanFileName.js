

export function cleanFileName(fileName) {
    return fileName
        .replace(/[^\w\s.-]/g, '') // Allow letters, numbers, spaces, dots, and hyphens
        .replace(/^\.+/, '')       // Remove leading dots
        .replace(/\s+/g, '_');     // Replace spaces with underscores
}



export function cleanFilePath(filePath) {
    const lastSlashIndex = filePath.lastIndexOf('/');
    const path = filePath.substring(0, lastSlashIndex + 1);
    return path; // Return the path without the filename
}