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

const agregatorDays = async (filtered) => {
    if(filtered.start_date && filtered.end_date) {
        console.log('ENTROU NO DAYS');
        some_days = await dumpService.searchDays();
        filtered['working_days'] = some_days.working_days;
        filtered['holidays'] = some_days.holidays;
    }
}

const agregatorDumpLazyValidation = async (filtered) => {
    if(filtered.trash) {
        console.log('ENTROU NO TRASH');
        await dumpService.trashTimeout();
    }
}

const create = async (parsedBody) => {
    filtered = {
        customer_id: parsedBody.customer_id,
        product_id: '1',
        product_name: 'GIRO',
        proposal_id: parsedBody.proposal_id,
        type: parsedBody.type,
        sub_type: parsedBody.sub_type,
        parcels: parsedBody.parcels,
        total_tax: parsedBody.total_tax,
        total_amount: parsedBody.total_amount,
        credit: parsedBody.credit,
        guarantee: parsedBody.guarantee,
        proposal_status: 'NOVO',
        start_date: parsedBody.start_date,
        end_date: parsedBody.end_date,
        trash: parsedBody.trash,
        created_date: (new Date()).getTime()
    };
    // validators
    // USE JSON SCHEMA HERE
    // agregatores DE MANEIRA SIMPLES MAS PARALELA
    await Promise.all([
        agregatorDays(filtered),
        agregatorDumpLazyValidation(filtered)
    ]);
    //
    await dbService.createGiroProposal(filtered);
    await snsService.pubNegotiation('NEW_NEGOTIATION', filtered);
    if(!parsedBody.credit || parsedBody.credit != 'SIM') {
        await snsService.pubTask('NEW_TASK', {
            customer_id: parsedBody.customer_id,
            product_id: '1',
            product_name: 'GIRO',
            proposal_id: parsedBody.proposal_id,
            task_status: 'ABERTA',
            task_type: 'CREDITO',
            priority: 'MEDIUM',
            task_message: 'Falta de avaliação de crédito',
            created_date: (new Date()).getTime()
        });
    }
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