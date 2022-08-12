## Node Version
`nvm use --delete-prefix v14.16.1`

## Compile
`npm i` inside layer and lambda functions folder.

## Local Test
`sam local start-api --env-vars env.json --profile personal`


## Build on AWS

`aws cloudformation package --template-file template.yaml --s3-bucket 371716203543-artifacts --s3-prefix builds --output-template-file template-output.yaml --profile personal`
## Deploy on AWS

`aws cloudformation deploy --template-file template-output.yaml --s3-bucket 371716203543-artifacts --s3-prefix builds --stack-name plat-app --capabilities CAPABILITY_NAMED_IAM --profile personal --parameter-overrides $(jq -r '.Parameters | to_entries | map("\(.key)=\(.value|tostring)") | .[]' config.json)`