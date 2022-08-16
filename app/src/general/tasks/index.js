const eventHelper = require('/opt/helper/eventHelper.js');
const dbService = require('/opt/service/dynamoOperations.js');

const readAll = async () => {
    return await dbService.getAllTask();
}

const readOne = async (task_id) => {
    let key = {
        task_id
    }
    return await dbService.getTask(key);
}

const lambdaHandler = async (event) => {
    if(event.Records && event.Records[0] && event.Records[0].Sns) {

        const task = JSON.parse(event.Records[0].Sns.Message);
        task['task_id'] = (new Date()).getTime();
        await dbService.createTask(task);

        return 'OK';
    } else {
        switch (event.httpMethod) {
            case 'GET':
                if(event.pathParameters && event.pathParameters.task_id) {
                    return eventHelper.createResponse(await readOne(event.pathParameters.task_id), 200);
                } else {
                    return eventHelper.createResponse(await readAll(), 200);
                }
            default:
                break;
        }
    }
}

module.exports = {
    lambdaHandler
}