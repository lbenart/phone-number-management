import Ajv from 'ajv';
import { IAllocateNumberParams } from './schemas/allocate_number';
import { IDeallocateNumberParams } from './schemas/deallocate_number';
import { ICreateOrganizationParams } from './schemas/create_organization';

export function validateAllocateNumberRequestBody(body: string | null): IAllocateNumberParams {
    const requestBody = JSON.parse(body ? body : '');
    if (!requestBody) {
        throw new Error('No valid request body received');
    }

    const ajv = new Ajv();
    const validateInputSchema = ajv.compile(allocateNumberInputSchema);
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

const allocateNumberInputSchema = {
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


export function validateDeallocateNumberRequestBody(body: string | null): IDeallocateNumberParams {
    const requestBody = JSON.parse(body ? body : '');
    if (!requestBody) {
        throw new Error('No valid request body received');
    }

    const ajv = new Ajv();
    const validateInputSchema = ajv.compile(deallocateNumberInputSchema);
    validateInputSchema(requestBody);

    if (validateInputSchema.errors) {
        console.error('Failure trying to validate request body for deallocate number', validateInputSchema.errors);
        const errors = JSON.stringify(validateInputSchema.errors[0]);
        throw new Error(`Request body does not conform to Deallocate Number schema: ${errors}`);
    }

    return {
        passport_id: requestBody.passport_id,
    };
}

const deallocateNumberInputSchema = {
    type: 'object',
    properties: {
        passport_id: {type: 'string'},
    },
    required: ['passport_id'],
    additionalProperties: false,
};

export function validateCreateOrgRequestBody(body: string | null): ICreateOrganizationParams {
    const requestBody = JSON.parse(body ? body : '');
    if (!requestBody) {
        throw new Error('No valid request body received');
    }

    const ajv = new Ajv();
    const validateInputSchema = ajv.compile(createOrganizationInputSchema);
    validateInputSchema(requestBody);

    if (validateInputSchema.errors) {
        console.error('Failure trying to validate request body for create organization', validateInputSchema.errors);
        const errors = JSON.stringify(validateInputSchema.errors[0]);
        throw new Error(`Request body does not conform to Create Organization schema: ${errors}`);
    }

    return {
        ID: requestBody.id,
        name: requestBody.name,
    };
}

const createOrganizationInputSchema = {
    type: 'object',
    properties: {
        id: {type: 'string'},
        name: {type: 'string'},
    },
    required: ['id', 'name'],
    additionalProperties: false,
};