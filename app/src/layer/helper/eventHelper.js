const createHeaders = () => {
    let headers = {};

    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Headers'] = 'Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Allow-Headers,Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token';
    headers['Access-Control-Allow-Methods'] = 'GET,OPTIONS,POST,PUT,DELETE';
    headers['Content-Type'] = 'application/json;charset=UTF-8';

    return headers;
}

const createResponse = (data, statusCode) => {
    return {
        statusCode: statusCode || 200,
        headers: createHeaders(),
        body: JSON.stringify(data)
    };
}

const createError = (err) => {
    console.error(err);
    let code = err.code || 500;
    let message = err.message ? JSON.stringify({'error': err.message}) : JSON.stringify(err);
    return {
        statusCode: code,
        headers: createHeaders(),
        body: message
    };
};

module.exports = {
    createResponse,
    createError
}