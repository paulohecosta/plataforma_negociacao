## Build on AWS

`aws cloudformation package --template-file template.yaml --s3-bucket 371716203543-artifacts --s3-prefix builds --output-template-file template-output.yaml --profile personal`
## Deploy on AWS

`aws cloudformation deploy --template-file template-output.yaml --s3-bucket 371716203543-artifacts --s3-prefix builds --stack-name plat-infra --capabilities CAPABILITY_NAMED_IAM --profile personal --parameter-overrides $(jq -r '.Parameters | to_entries | map("\(.key)=\(.value|tostring)") | .[]' config.json)`