import Joi from '@hapi/joi';
import { ServerRoute, Request, Util } from '@hapi/hapi';
import { serverMethods } from '../../server';
import failAction from '../../lib/fail-action';
import generate from 'nanoid/generate';
import nodemailer from 'nodemailer';

/* eslint-disable */
const emailBody = Joi.object({ email: Joi.string().email() })
const responseSchema = Joi.object({ token: Joi.string().length(6) })
/* eslint-enable */

interface TokenResponse {
    token: string
}

const transporter = nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
    secure: false
});

async function createToken(request: Request): Promise<TokenResponse> {
    const methods = serverMethods(request);
    const projectDatasource = methods.projectDatasource();

    const { email } = request.payload as Util.Dictionary<string>;
    const token = generate('1234567890abcdef', 6);
    projectDatasource.setToken(email, token);

    return transporter.sendMail({
        from: 'help@hingehealth.com',
        to: email, // An array if you have multiple recipients.
        subject: 'One Time Token',
        //You can use "html:" to send HTML email content. It's magic!
        html: `Temporary token: ${token}`,
    }).then(() => ({ token }))
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
