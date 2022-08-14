const AWS = require("aws-sdk");

const pubNegotiation = (subject, json_message) => {

    return new Promise((resolve, reject) => {

        const sns = new AWS.SNS({
            region: process.env.AWS_REGION,
        });

        let params = {
            Subject: subject,
            Message: JSON.stringify(json_message),
            TopicArn: 'arn:aws:sns:us-east-2:371716203543:plat-infra-negotiation-topic',
        };
    
        sns.publish(params, function (err, data) {
            if (err) {
                console.log('erro SNS');
                reject({
                    status: "500",
                    err: err,
                });
            } else {
                console.log('OK SNS');
                resolve({
                    status: "ok",
                    data: data,
                });
            }
        });
    });
}

const pubTask = (subject, json_message) => {

    return new Promise((resolve, reject) => {

        const sns = new AWS.SNS({
            region: process.env.AWS_REGION,
        });

        let params = {
            Subject: subject,
            Message: JSON.stringify(json_message),
            TopicArn: 'arn:aws:sns:us-east-2:371716203543:plat-infra-task-topic',
        };
    
        sns.publish(params, function (err, data) {
            if (err) {
                console.log('erro SNS');
                reject({
                    status: "500",
                    err: err,
                });
            } else {
                console.log('OK SNS');
                resolve({
                    status: "ok",
                    data: data,
                });
            }
        });
    });
}

module.exports = {
    pubNegotiation,
    pubTask
}