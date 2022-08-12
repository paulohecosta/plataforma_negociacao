const eventHelper = require('/opt/helper/eventHelper.js');
const dbService = require('/opt/service/dynamoOperations.js');

const readAll = async () => {
    return await dbService.getAllCustomer();
}

const readOne = async (customer_id) => {
    let key = {
        customer_id
    }
    return await dbService.getCustomer(key);
}

const create = async (parsedBody) => {
    filtered = {
        customer_id: parsedBody.customer_id,
        name: parsedBody.name,
        segment: parsedBody.segment
    };
    return await dbService.createCustomer(filtered);
}

const lambdaHandler = async (event) => {
    switch (event.httpMethod) {
        case 'GET':
            if(event.pathParameters && event.pathParameters.customer_id) {
                return eventHelper.createResponse(await readOne(event.pathParameters.customer_id), 200);
            } else {
                return eventHelper.createResponse(await readAll(), 200);
            }            
        case 'POST':
            return eventHelper.createResponse(await create(JSON.parse(event.body)), 201);
        default:
            callback(null, createError({'error': 'Method not defined!'}));
            break;
    }
}

module.exports = {
    lambdaHandler
}