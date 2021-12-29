import { requireJsonc } from '../utils/requireJsonc';
import { getTypeTransformer } from '../utils/validator';

export const liveTestOutputSchema = requireJsonc(__dirname + '/LiveTestOutputSchema.json');

export type LiveTestOutput = {
    total: number;
    success: number;
    fail: number;
    apiCoverage: number;
    codeCoverage: number;
};

export const getLiveTestOutput = getTypeTransformer<LiveTestOutput>(
    liveTestOutputSchema,
    'InitOutput'
);
