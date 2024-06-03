import {APIGatewayEvent} from 'aws-lambda';
import * as fs from 'fs';
import * as path from 'path';


export async function serveDocs(event: APIGatewayEvent) {
    try {
        const openApiDoc = fs.readFileSync(path.join(__dirname, '../openapi.yml'), 'utf8');
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain',
            },
            body: openApiDoc,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error reading OpenAPI documentation', error }),
        };
    }
}