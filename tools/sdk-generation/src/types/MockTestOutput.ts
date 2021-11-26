import { requireJsonc } from '../utils/requireJsonc';
import { getTypeTransformer } from '../utils/validator';
import {StringMap} from "@ts-common/azure-js-dev-tools";

export const mockTestOutputSchema = requireJsonc(__dirname + '/MockTestOutputSchema.json');

export type MockTestOutput = {
    total: number;
    success: number;
    fail: number;
    apiCoverage: number;
    codeCoverage: number;
};

export const getMockTestOutput = getTypeTransformer<MockTestOutput>(
    mockTestOutputSchema,
    'InitOutput'
);
