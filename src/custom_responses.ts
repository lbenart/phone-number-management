export function createSuccessResponse(customMessage: string): {statusCode: number, body: string, headers: any} {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `${customMessage}`,
        }),
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,PUT,POST,GET"
        }
    }
}

export function createSuccessCreatedResponse(customMessage: string): {statusCode: number, body: string, headers: any} {
    return {
        statusCode: 201,
        body: JSON.stringify({
            message: `${customMessage}`,
        }),
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        }
    }
}

export function createError400Response(customMessage: string, error: Error): {statusCode: number, body: string, headers: any} {
    console.error(customMessage);
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: `ERROR: ${customMessage}`,
            error: error.toString(),
        }),
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,PUT,POST,GET"
        }
    };
}

export function createUnknownErrorResponse(customMessage: string): {statusCode: number, body: string, headers: any} {
    console.error('Unknown error', customMessage);
    return {
        statusCode: 500,
        body: JSON.stringify({
            message: `${customMessage}`,
            error: 'Unknown error',
        }),
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,PUT,POST,GET"
        }
    };
}

export class ErrorResponse404 extends Error {
    constructor(public name: string, public message: string) {
        super();
    }
}

export function createError404Response(customMessage: string): {statusCode: number, body: string, headers: any} {
    console.error(customMessage);
    return {
        statusCode: 404,
        body: JSON.stringify({
            message: customMessage
        }),
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,PUT,POST,GET"
        }
    };
}
