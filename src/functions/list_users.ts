import { APIGatewayEvent } from 'aws-lambda';
import { createError400Response, createSuccessResponse, createUnknownErrorResponse } from '../custom_responses';
import { listUsersWithAllocatedNumbers } from '../services/list_users';

export async function listUsers(event: APIGatewayEvent) {

    const organizationId = event.pathParameters?.organization_id;
    if (!organizationId) {
        return createError400Response('failure trying to validate event request',new Error('No organization id provided'));
    }

    try{
        const users = await listUsersWithAllocatedNumbers(organizationId);
        return {
            statusCode: 200,
            body: JSON.stringify(users),
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET'
            },
        };
    } catch (error) {
        if (error instanceof Error) {
            return createError400Response('failure trying to list users', error);
        }
        return createUnknownErrorResponse('something went wrong trying to list users');
    }
}
