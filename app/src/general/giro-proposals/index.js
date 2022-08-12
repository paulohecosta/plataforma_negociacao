const eventHelper = require('/opt/helper/eventHelper.js');
const dbService = require('/opt/service/dynamoOperations.js');
const snsService = require('/opt/service/snsOperations.js');

const create = async (parsedBody) => {
    filtered = {
        customer_id: parsedBody.customer_id,
        product_id: parsedBody.customer_id,
        proposal_id: parsedBody.proposal_id,
        type: parsedBody.type,
        sub_type: parsedBody.sub_type,
        parcels: parsedBody.parcels,
        total_amount: parsedBody.total_amount
    };
    await dbService.createGiroProposal(filtered);
    await snsService.pubNegotiation('NEW_NEGOTIATION', filtered);
    return {
        "status": "OK"
    }
}

const lambdaHandler = async (event) => {
    switch (event.httpMethod) {         
        case 'POST':
            const result = await create(JSON.parse(event.body));
            console.log(JSON.stringify(result));
            return eventHelper.createResponse(result, 201);
        default:
            break;
    }
}

module.exports = {
    lambdaHandler
}