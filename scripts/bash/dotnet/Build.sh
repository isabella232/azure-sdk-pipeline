#!/bin/bash

cd $(Pipeline.Workspace)/s/$(SDK_REPO_NAME)/sdk/$(ResourceProvider)/Azure.ResourceManager.$(ResourceProvider)/src
dotnet build