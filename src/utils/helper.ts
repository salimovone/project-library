export const formatDateReadable = (isoString) => {
    const date = new Date(isoString);

    return date.toLocaleString('uz-UZ', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}