import { APIGatewayEvent } from 'aws-lambda';
import { validateCreateOrgRequestBody } from '../event_validator';
import { ICreateOrganizationParams } from '../schemas/create_organization';
import { createError400Response, createSuccessResponse, createUnknownErrorResponse } from '../custom_responses';
import { createOrganization } from '../services/create_organization';

export async function createOrganizationHandler(event: APIGatewayEvent) {

    let requestBody: ICreateOrganizationParams;
    try {
        requestBody = validateCreateOrgRequestBody(event.body);
    } catch (error) {
        if (error instanceof Error) {
            return createError400Response('failure trying to validate event request', error);
        }
        return createUnknownErrorResponse('something went wrong trying to validate request body');
    }

    try{
        await createOrganization(requestBody.ID, requestBody.name);
        return createSuccessResponse('success');
    } catch (error) {
        if (error instanceof Error) {
            return createError400Response('failure trying to allocate phone number', error);
        }
        return createUnknownErrorResponse('something went wrong trying to allocate phone number');
    }
}