import { APIGatewayEvent } from 'aws-lambda';
import { validateCreateOrgRequestBody } from '../event_validator';
import { ICreateOrganizationParams } from '../schemas/create_organization';
import { createError400Response, createSuccessCreatedResponse, createSuccessResponse, createUnknownErrorResponse } from '../custom_responses';
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
        const response = await createOrganization(requestBody.ID, requestBody.name);
        return createSuccessCreatedResponse(response);
    } catch (error) {
        if (error instanceof Error) {
            return createError400Response('failure trying to create organization', error);
        }
        return createUnknownErrorResponse('something went wrong trying to create organization');
    }
}