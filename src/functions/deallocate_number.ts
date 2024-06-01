import { APIGatewayEvent } from 'aws-lambda';
import { validateDeallocateNumberRequestBody } from '../event_validator';
import { IDeallocateNumberParams } from '../schemas/deallocate_number';
import { createError400Response, createSuccessResponse, createUnknownErrorResponse } from '../custom_responses';
import { deallocatePhoneNumber } from '../services/deallocate_number';

export async function deallocateNumber(event: APIGatewayEvent) {

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
        await deallocatePhoneNumber(requestBody);
        return createSuccessResponse('success');
    } catch (error) {
        if (error instanceof Error) {
            return createError400Response('failure trying to allocate phone number', error);
        }
        return createUnknownErrorResponse('something went wrong trying to allocate phone number');
    }

}