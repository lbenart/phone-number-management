import Ajv from 'ajv';
import { IAllocateNumberParams } from './schemas/allocate_number';

export function validateAllocateNumberRequestBody(body: string | null): IAllocateNumberParams {
    const requestBody = JSON.parse(body ? body : '');
    if (!requestBody) {
        throw new Error('No valid request body received');
    }

    const ajv = new Ajv();
    const validateInputSchema = ajv.compile(creteUserInputSchema);
    validateInputSchema(requestBody);

    if (validateInputSchema.errors) {
        console.error('Failure trying to validate request body for allocate number', validateInputSchema.errors);
        const errors = JSON.stringify(validateInputSchema.errors[0]);
        throw new Error(`Request body does not conform to Allocate Number schema: ${errors}`);
    }

    return {
        passport_id: requestBody.passport_id,
        first_name: requestBody.first_name,
        last_name: requestBody.last_name,
        organization_id: requestBody.organization_id,
    };
}

const creteUserInputSchema = {
    type: 'object',
    properties: {
        passport_id: {type: 'string'},
        first_name: {type: 'string'},
        last_name: {type: 'string'},
        organization_id: {type: 'string'},
    },
    required: ['passport_id', 'first_name', 'last_name', 'organization_id'],
    additionalProperties: false,
};
