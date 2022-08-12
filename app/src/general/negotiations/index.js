const eventHelper = require('/opt/helper/eventHelper.js');
const dbService = require('/opt/service/dynamoOperations.js');

const lambdaHandler = async (event) => {
    console.log(event);
    if(event.Records && event.Records[0] && event.Records[0].Sns) {
        console.log(event.Records[0].Sns);
    }
    // switch (event.httpMethod) {
    //     case 'GET':
    //         if(event.pathParameters && event.pathParameters.customer_id) {
    //             return eventHelper.createResponse(await readOne(event.pathParameters.customer_id), 200);
    //         } else {
    //             return eventHelper.createResponse(await readAll(), 200);
    //         }            
    //     case 'POST':
    //         return eventHelper.createResponse(await create(JSON.parse(event.body)), 201);
    //     default:
    //         break;
    // }
}

module.exports = {
    lambdaHandler
}