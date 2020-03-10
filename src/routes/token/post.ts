import Joi from '@hapi/joi';
import { ServerRoute, Request, Util } from '@hapi/hapi';
import { serverMethods } from '../../server';
import failAction from '../../lib/fail-action';
import generate from 'nanoid/generate';

/* eslint-disable */
const emailBody = Joi.object({ email: Joi.string().email() })
const responseSchema = Joi.object({ token: Joi.string().length(6) })
/* eslint-enable */

interface TokenResponse {
    token: string
}

function createToken(request: Request): TokenResponse {
    const methods = serverMethods(request);
    const projectDatasource = methods.projectDatasource();

    const { email } = request.payload as Util.Dictionary<string>;
    const token = generate('1234567890abcdef', 6);
    projectDatasource.setToken(email, token);

    return {
        token
    }
}

const getNewToken: ServerRoute = {
    method: 'POST',
    path: '/token/new',
    options: {
        auth: false,
        handler: createToken,
        description: 'Get project by id',
        notes: 'Returns project.',
        tags: ['api'],
        response: {
            schema: responseSchema
        },
        cors: {
            origin: ['*']
        },
        validate: {
            failAction,
            payload: emailBody
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
                responses: {
                    '200': {
                        description: 'Success'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        }
    }
};

export default getNewToken;
