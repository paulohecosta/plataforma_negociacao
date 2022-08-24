const searchDays = () => {
    return new Promise(function (resolve) {
        setTimeout(resolve({
            working_days: 173,
            holidays: 6
        }), 100);
    });
}

const trashTimeout = () => {
    return new Promise(function (resolve) {
        setTimeout(resolve(true), 1200);
    });
}

module.exports = {
    searchDays,
    trashTimeout
}