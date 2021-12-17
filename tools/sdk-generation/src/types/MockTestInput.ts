import { requireJsonc } from '../utils/requireJsonc';
import { getTypeTransformer } from '../utils/validator';
import {StringMap} from "@ts-common/azure-js-dev-tools";

export const mockTestInputSchema = requireJsonc(__dirname + '/MockTestInputSchema.json');

export type MockTestInput = {
    packageFolder: string;
    mockServerHost: string;
};

export const getMockTestInput = getTypeTransformer<MockTestInput>(
    mockTestInputSchema,
    'InitOutput'
);
