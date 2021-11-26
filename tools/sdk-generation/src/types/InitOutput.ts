import { requireJsonc } from '../utils/requireJsonc';
import { getTypeTransformer } from '../utils/validator';
import {StringMap} from "@ts-common/azure-js-dev-tools";

export const initOutputSchema = requireJsonc(__dirname + '/InitOutputSchema.json');

export type InitOutput = {
    envs: StringMap<string | boolean | number>;
};

export const initOutput = getTypeTransformer<InitOutput>(
    initOutputSchema,
    'InitOutput'
);
