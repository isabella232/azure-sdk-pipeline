import { requireJsonc } from '../utils/requireJsonc';
import { getTypeTransformer } from '../utils/validator';

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
