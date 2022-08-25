const eventHelper = require('/opt/helper/eventHelper.js');
const dbService = require('/opt/service/dynamoOperations.js');
const snsService = require('/opt/service/snsOperations.js');
const dumpService = require('/opt/service/mockServices.js');

const readOne = async (proposal_id) => {
    try {
        return await dbService.getGiroProposal(proposal_id);
    } catch (error) {
        console.log(JSON.stringify(error));
        console.log(error.errorMessage);
    }
}

const readAll = async () => {
    return await dbService.getAllGiroProposal();
}

const create = async (parsedBody) => {
    filtered = {
        customer_id: parsedBody.customer_id,
        product_id: '2',
        product_name: 'CESSAO CREDITO',
        proposal_id: parsedBody.proposal_id,
        type: parsedBody.type,
        sub_type: parsedBody.sub_type,
        proposal_status: 'NOVO',
        created_date: (new Date()).getTime()
    };
    await dbService.createCessaoProposal(filtered);
    await snsService.pubNegotiation('NEW_NEGOTIATION', filtered);
    return {
        "status": "OK"
    }
}

const lambdaHandler = async (event) => {
    switch (event.httpMethod) {       
        case 'GET':
            if(event.pathParameters && event.pathParameters.proposal_id) {
                return eventHelper.createResponse(await readOne(event.pathParameters.proposal_id), 200);
            } else {
                return eventHelper.createResponse(await readAll(), 200);
            }
        case 'POST':
            try {
                const result = await create(JSON.parse(event.body));
                console.log(JSON.stringify(result));
                return eventHelper.createResponse(result, 201);
            } catch (error) {
                console.error(JSON.stringify(error));
            }
        default:
            break;
    }
}

module.exports = {
    lambdaHandler
}