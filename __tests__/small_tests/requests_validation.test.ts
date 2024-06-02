import { validateAllocateNumberRequestBody, validateCreateOrgRequestBody } from '../../src/event_validator';
import { IAllocateNumberParams } from '../../src/schemas/allocate_number';
import { ICreateOrganizationParams } from '../../src/schemas/create_organization';

describe('validateAllocateNumberRequestBody', () => {
    test('successfully validates a valid request body', () => {
        const validBody = JSON.stringify({
            passport_id: '12345',
            first_name: 'John',
            last_name: 'Doe',
            organization_id: 'org1'
        });

        const result: IAllocateNumberParams = validateAllocateNumberRequestBody(validBody);

        expect(result).toEqual({
            passport_id: '12345',
            first_name: 'John',
            last_name: 'Doe',
            organization_id: 'org1'
        });
    });

    test('throws an error when request body is not valid JSON', () => {
        const invalidJsonBody = '{passport_id: "12345", first_name: "John", last_name: "Doe", organization_id: "org1"}';
        
        expect(() => validateAllocateNumberRequestBody(invalidJsonBody)).toThrow(SyntaxError);
    });

    test('throws an error when required fields are missing', () => {
        const invalidBody = JSON.stringify({
            passport_id: '12345',
            first_name: 'John'
        });

        expect(() => validateAllocateNumberRequestBody(invalidBody)).toThrow(/Request body does not conform to Allocate Number schema/);
    });

    test('throws an error when there are additional properties', () => {
        const invalidBody = JSON.stringify({
            passport_id: '12345',
            first_name: 'John',
            last_name: 'Doe',
            organization_id: 'org1',
            extra_field: 'extra'
        });

        expect(() => validateAllocateNumberRequestBody(invalidBody)).toThrow(/Request body does not conform to Allocate Number schema/);
    });
});


describe('validateCreateOrgRequestBody', () => {
    test('successfully validates a valid request body', () => {
        const validBody = JSON.stringify({
            id: 'org123',
            name: 'Test Organization'
        });

        const result: ICreateOrganizationParams = validateCreateOrgRequestBody(validBody);

        expect(result).toEqual({
            ID: 'org123',
            name: 'Test Organization'
        });
    });

    test('throws an error when request body is not valid JSON', () => {
        const invalidJsonBody = '{id: "org123", name: "Test Organization"}';
        
        expect(() => validateCreateOrgRequestBody(invalidJsonBody)).toThrow(SyntaxError);
    });

    test('throws an error when required fields are missing', () => {
        const invalidBody = JSON.stringify({
            id: 'org123'
        });

        expect(() => validateCreateOrgRequestBody(invalidBody)).toThrow(/Request body does not conform to Create Organization schema/);
    });

    test('throws an error when there are additional properties', () => {
        const invalidBody = JSON.stringify({
            id: 'org123',
            name: 'Test Organization',
            extra_field: 'extra'
        });

        expect(() => validateCreateOrgRequestBody(invalidBody)).toThrow(/Request body does not conform to Create Organization schema/);
    });
});
