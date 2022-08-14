const eventHelper = require('/opt/helper/eventHelper.js');
const dbService = require('/opt/service/dynamoOperations.js');

const readAll = async () => {
    return await dbService.getAllNegotiation();
}

const readOne = async (negotiation_id) => {
    let key = {
        negotiation_id
    }
    return await dbService.getNegotiation(key);
}

const lambdaHandler = async (event) => {
    if(event.Records && event.Records[0] && event.Records[0].Sns) {

        console.log(event.Records[0].Sns);

        const neg = JSON.parse(event.Records[0].Sns.Message);
        neg['negotiation_id'] = `${neg.product_id}${neg.proposal_id}`;
        await dbService.createNegotiation(neg);
        
        return 'OK';
    } else {
        switch (event.httpMethod) {
            case 'GET':
                if(event.pathParameters && event.pathParameters.negotiation_id) {
                    return eventHelper.createResponse(await readOne(event.pathParameters.negotiation_id), 200);
                } else {
                    return eventHelper.createResponse(await readAll(), 200);
                }
                break;
            default:
                break;
        }
    }
}

module.exports = {
    lambdaHandler
}