
export function getDayDelta(startDate: Date) {
    const today = new Date();
    const differenceInTime = today.getTime() - startDate.getTime();
    const deltaInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return deltaInDays;
}