import { APIGatewayEvent } from 'aws-lambda';
import { validateDeallocateNumberRequestBody } from '../event_validator';
import { IDeallocateNumberParams } from '../schemas/deallocate_number';
import { createError400Response, ErrorResponse404, createError404Response, 
         createSuccessResponse, createUnknownErrorResponse } from '../custom_responses';
import { deallocatePhoneNumber } from '../services/deallocate_number';

export async function deallocateNumber(event: APIGatewayEvent) {

    const apiKey = event.headers['x-api-key'];

    if (!apiKey) {
        return createError400Response('Authorization header missing', new Error('Missing API key'));
    }

    let requestBody: IDeallocateNumberParams;
    try {
        requestBody = validateDeallocateNumberRequestBody(event.body);
    } catch (error) {
        if (error instanceof Error) {
            return createError400Response('failure trying to validate event request', error);
        }
        return createUnknownErrorResponse('something went wrong trying to validate request body');
    }

    try{
        await deallocatePhoneNumber(requestBody, apiKey);
        return createSuccessResponse('success');
    } catch (error) {
        if (error instanceof ErrorResponse404){
            return createError404Response(error.message);
        }
        if (error instanceof Error) {
            return createError400Response('failure trying to deallocate phone number', error);
        }
        return createUnknownErrorResponse('something went wrong trying to deallocate phone number');
    }
}