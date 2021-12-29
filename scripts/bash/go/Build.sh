#!/bin/bash
if [ -z $1 ]; then
    echo "Please input resource Provider name"
fi
ResourceProvider=$1

if [ -z $2 ]; then
    echo "Please input sdk dir path"
fi
SDK_DIR_PATH=$2

CODE_PATH=${SDK_DIR_PATH}/sdk/${ResourceProvider}/arm${ResourceProvider}
cd ${CODE_PATH}
# go get github.com/Azure/azure-sdk-for-go/sdk/azidentity@latest && go get github.com/Azure/azure-sdk-for-go/sdk/armcore@latest && go get github.com/Azure/azure-sdk-for-go/sdk/azcore@latest && go get github.com/Azure/azure-sdk-for-go/sdk/to@latest && go mod tidy
go mod tidy
# go mod download github.com/Azure/azure-sdk-for-go/sdk/armcore
# go get github.com/Azure/azure-sdk-for-go/sdk/armcore@v0.8.0
go build