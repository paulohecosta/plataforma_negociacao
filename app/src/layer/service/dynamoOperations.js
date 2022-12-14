const AWS = require('aws-sdk');
//var uuid = require('uuid');

const constantVars = {
    CUSTOMERS_TABLE: 'plat-infra-customers',
    GIRO_PROPOSALS_TABLE: 'plat-infra-giro-proposals',
    CESSAO_PROPOSALS_TABLE: 'plat-infra-cessao-proposals',
    NEGOTIATIONS_TABLE: 'plat-infra-negotiations',
    TASKS_TABLE: 'plat-infra-tasks'
}


const createItem = (tableName, obj) => {

    return new Promise((resolve, reject) => {
        let envVars = process.env;

        AWS.config.update({
            region: envVars.AWS_REGION
        });

        let docClient = new AWS.DynamoDB.DocumentClient();

        let table = tableName;

        let params = {
            TableName: table,
            Item: obj
        };

        docClient.put(params, function (err) {
            if (err) {
                reject({ 'message': 'Unable to add item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve({
                    'status': 'CREATED'
                });
            }
        });
    });
}

const updateItem = (tableName, keySchema, attrsObj) => {

    return new Promise((resolve, reject) => {
        let envVars = process.env;

        AWS.config.update({
            region: envVars.AWS_REGION
        });

        let docClient = new AWS.DynamoDB.DocumentClient();

        let table = tableName;

        let keyNames = Object.keys(attrsObj);
        let expressionObj = {};
        let updateExpression = 'set ';
        keyNames.forEach((elem, index, arr) => {
            expressionObj[':' + elem] = attrsObj[elem];
            if (index === arr.length - 1) {
                updateExpression += ' ' + elem + ' = :' + elem;
            } else {
                updateExpression += ' ' + elem + ' = :' + elem + ',';
            }
        });

        let params = {
            TableName: table,
            Key: keySchema,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionObj,
            ReturnValues: 'UPDATED_NEW'
        };

        docClient.update(params, function (err) {
            if (err) {
                reject({ 'message': 'Unable to update item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve({
                    'status': 'UPDATED'
                });
            }
        });
    });
}

const getItem = (tableName, key) => {

    return new Promise((resolve, reject) => {
        let envVars = process.env;

        AWS.config.update({
            region: envVars.AWS_REGION
        });

        let docClient = new AWS.DynamoDB.DocumentClient();

        let params = {
            TableName: tableName,
            Key: key
        };

        docClient.get(params, function (err, data) {
            if (err) {
                reject({ 'message': 'Unable to get item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve(data);
            }
        });
    });
}

const getItemScan = (tableName, rangeKey, rangeValue) => {
    return new Promise((resolve, reject) => {
        let envVars = process.env;
        AWS.config.update({
            region: envVars.AWS_REGION
        });
        let docClient = new AWS.DynamoDB.DocumentClient();
        let params = {
            TableName: tableName,
            KeyConditionExpression: '#rangeKey = :rangeValue',
            ExpressionAttributeNames: {
                '#rangeKey': rangeKey,
            },
            ExpressionAttributeValues: {
                ':rangeValue': rangeValue
            }
        };
        docClient.query(params, function (err, data) {
            if (err) {
                reject({ 'message': 'Unable to get item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve(data);
            }
        });
    });
}

const getAllItems = (tableName) => {

    return new Promise((resolve, reject) => {
        let envVars = process.env;
        AWS.config.update({
            region: envVars.AWS_REGION
        });

        let docClient = new AWS.DynamoDB.DocumentClient();

        let params = {
            TableName: tableName
        };

        docClient.scan(params, function (err, data) {
            if (err) {
                reject({ 'message': 'Unable to get item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve(data);
            }
        });
    });
}

const getAllRangeItems = (tableName, rangeKey, rangeValue) => {

    return new Promise((resolve, reject) => {
        let envVars = process.env;

        AWS.config.update({
            region: envVars.AWS_REGION
        });

        let docClient = new AWS.DynamoDB.DocumentClient();

        let params = {
            TableName: tableName,
            FilterExpression: '#rangeKey = :rangeValue',
            ExpressionAttributeNames: {
                '#rangeKey': rangeKey,
            },
            ExpressionAttributeValues: {
                ':rangeValue': rangeValue
            }
        };

        docClient.scan(params, function (err, data) {
            if (err) {
                reject({ 'message': 'Unable to get item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve(data);
            }
        });
    });
}

const deleteItem = (tableName, key) => {

    return new Promise((resolve, reject) => {
        let envVars = process.env;

        AWS.config.update({
            region: envVars.AWS_REGION
        });

        let docClient = new AWS.DynamoDB.DocumentClient();

        let params = {
            TableName: tableName,
            Key: key
        };

        docClient.delete(params, function (err) {
            if (err) {
                reject({ 'message': 'Unable to delete item. Error JSON: ' + JSON.stringify(err, null, 2) });
            } else {
                resolve({
                    'status': 'DELETED'
                });
            }
        });
    });
}

const createCustomer = (obj) => {
    return createItem(constantVars.CUSTOMERS_TABLE, obj);
}

const updateCustomer = (obj, attrsObj) => {
    return updateItem(constantVars.CUSTOMERS_TABLE, obj, attrsObj);
}

const getCustomer = (key) => {
    return new Promise((resolve, reject) => {
        getItem(constantVars.CUSTOMERS_TABLE, key)
            .then(data => {
                if (data.Item) {
                    resolve({
                        customer: data.Item
                    });
                } else {
                    reject('RECORD_NOT_FOUND');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

const getAllCustomer = () => {
    return new Promise((resolve, reject) => {
        getAllItems(constantVars.CUSTOMERS_TABLE)
            .then(data => {
                if (data.Items) {
                    resolve({
                        customers: data.Items
                    });
                } else {
                    reject('RECORD_NOT_FOUND');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

const deleteCustomer = (key) => {
    return deleteItem(constantVars.CUSTOMERS_TABLE, key);
}

const createCessaoProposal = (obj) => {
    return createItem(constantVars.CESSAO_PROPOSALS_TABLE, obj);
}

const createGiroProposal = (obj) => {
    return createItem(constantVars.GIRO_PROPOSALS_TABLE, obj);
}

const updateGiroProposal = (obj, attrsObj) => {
    return updateItem(constantVars.GIRO_PROPOSALS_TABLE, obj, attrsObj);
}

const getGiroProposal = (key) => {
    return new Promise((resolve, reject) => {
        getItemScan(constantVars.GIRO_PROPOSALS_TABLE, 'proposal_id', key)
            .then(data => {
                if (data.Items) {
                    resolve({
                        proposal: data.Items[0]
                    });
                } else {
                    reject('RECORD_NOT_FOUND');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

const getAllGiroProposal = () => {
    return new Promise((resolve, reject) => {
        getAllItems(constantVars.GIRO_PROPOSALS_TABLE)
            .then(data => {
                if (data.Items) {
                    resolve({
                        proposals: data.Items
                    });
                } else {
                    reject('RECORD_NOT_FOUND');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

const deleteGiroProposal = (key) => {
    return deleteItem(constantVars.GIRO_PROPOSALS_TABLE, key);
}

const createNegotiation = (obj) => {
    return createItem(constantVars.NEGOTIATIONS_TABLE, obj);
}

const getNegotiation = (key) => {
    return new Promise((resolve, reject) => {
        getItem(constantVars.NEGOTIATIONS_TABLE, key)
            .then(data => {
                if (data.Item) {
                    resolve({
                        negotiation: data.Item
                    });
                } else {
                    reject('RECORD_NOT_FOUND');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

const getAllCustomerNegotiation = (customer_id) => {
    return new Promise((resolve, reject) => {
        getAllRangeItems(constantVars.NEGOTIATIONS_TABLE, 'customer_id', customer_id)
            .then(data => {
                if (data.Item) {
                    resolve({
                        negotiations: [data.Item]
                    });
                }
                if (data.Items) {
                    resolve({
                        negotiations: data.Items
                    });
                } else {
                    reject('RECORD_NOT_FOUND');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

const getAllNegotiation = () => {
    return new Promise((resolve, reject) => {
        getAllItems(constantVars.NEGOTIATIONS_TABLE)
            .then(data => {
                if (data.Items) {
                    resolve({
                        negotiations: data.Items
                    });
                } else {
                    reject('RECORD_NOT_FOUND');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

const createTask = (obj) => {
    return createItem(constantVars.TASKS_TABLE, obj);
}

const getTask = (key) => {
    return new Promise((resolve, reject) => {
        getItem(constantVars.TASKS_TABLE, key)
            .then(data => {
                if (data.Item) {
                    resolve({
                        task: data.Item
                    });
                } else {
                    reject('RECORD_NOT_FOUND');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

const getAllTask = () => {
    return new Promise((resolve, reject) => {
        getAllItems(constantVars.TASKS_TABLE)
            .then(data => {
                if (data.Items) {
                    resolve({
                        tasks: data.Items
                    });
                } else {
                    reject('RECORD_NOT_FOUND');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

module.exports = {
    createItem,
    updateItem,
    getItem,
    deleteItem,
    getAllItems,
    getAllRangeItems,
    createCustomer,
    updateCustomer,
    getCustomer,
    getAllCustomer,
    deleteCustomer,
    createGiroProposal,
    createNegotiation,
    getNegotiation,
    getAllNegotiation,
    getAllCustomerNegotiation,
    createTask,
    getTask,
    getAllTask,
    getGiroProposal,
    getAllGiroProposal,
    createCessaoProposal
}