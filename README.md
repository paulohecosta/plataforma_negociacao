# PoC de Plataforma de Boletagem de Operacoes Descentralizada

## Node Version
`nvm use --delete-prefix v14.16.1`

## Compile
`npm i` inside layer and lambda functions folder.

## Local Test
`sam local invoke "CoinSeller" --env-vars env.json`

## Build on AWS
`npm i` inside layer and lambda functions folder.

`aws cloudformation package --template-file template.yaml --s3-bucket coins-artifacts --s3-prefix builds --output-template-file template-output.yaml --profile personal`
## Deploy on AWS

`aws cloudformation deploy --template-file template-output.yaml --s3-bucket coins-artifacts --s3-prefix builds --stack-name coin-analysis --capabilities CAPABILITY_NAMED_IAM --profile personal --parameter-overrides $(jq -r '.Parameters | to_entries | map("\(.key)=\(.value|tostring)") | .[]' config.json)`