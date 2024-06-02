import {APIGatewayEvent} from 'aws-lambda';
import {validateAllocateNumberRequestBody} from '../event_validator';
import {IAllocateNumberParams} from '../schemas/allocate_number';
import {ErrorResponse404, createError400Response, createError404Response, 
        createSuccessResponse, createUnknownErrorResponse} from '../custom_responses';
import {allocatePhoneNumber} from '../services/allocate_numbers';


export async function allocateNumber(event: APIGatewayEvent) {

    let requestBody: IAllocateNumberParams;
    try {
        requestBody = validateAllocateNumberRequestBody(event.body);
    } catch (error) {
        if (error instanceof Error) {
            return createError400Response('failure trying to validate event request', error);
        }
        return createUnknownErrorResponse('something went wrong trying to validate request body');
    }

    try{
        await allocatePhoneNumber(requestBody);
        return createSuccessResponse('success');
    } catch (error) {
        if (error instanceof ErrorResponse404){
            return createError404Response(error.message);
        }
        if (error instanceof Error) {
            return createError400Response('failure trying to allocate phone number', error);
        }
        return createUnknownErrorResponse('something went wrong trying to allocate phone number');
    }
}