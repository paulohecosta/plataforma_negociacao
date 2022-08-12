const eventHelper = require('/opt/helper/eventHelper.js');
const dbService = require('/opt/service/dynamoOperations.js');

const create = async (parsedBody) => {
    filtered = {
        customer_id: parsedBody.customer_id,
        proposal_id: parsedBody.proposal_id
    };
    return await dbService.createGiroProposal(filtered);
}

const lambdaHandler = async (event) => {
    switch (event.httpMethod) {         
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