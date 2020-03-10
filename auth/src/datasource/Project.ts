import { IDatabase } from 'pg-promise';
import Config from '../lib/config';
// import logger, { Logger } from '../lib/logger';
import bcrypt from 'bcrypt';
import getConnection from '../lib/connection';

export default class ProjectDatasource {
    private connection: IDatabase<unknown>;
    private tokenCache: any;
    // private logger: Logger;

    constructor(config: Config, connection: IDatabase<unknown>) {
        this.connection = connection || getConnection(config);
        this.tokenCache = {}
        // this.logger = logger;
    }

    public async setToken(email: string, token: string) {
        await this.saveTempPassword(email, token);
        this.tokenCache[email] = {
            timestamp: Date.now(),
            token: token,
        }
    }

    private saveTempPassword(email: string, token: string): Promise<void> {
        const sql = 'UPDATE users set encrypted_password = $[wowThisIsGross] where email = $[email]'
        const salty = 10;

        const wowThisIsGross = bcrypt.hashSync(token, salty);
        return this.connection.none(sql, { wowThisIsGross, email });
    }



    //   public async selectAll(): Promise<any> {
    //     const SELECT_ALL = `
    //   SELECT
    //     id,
    //     name,
    //     created,
    //     updated
    //   FROM "project"
    // `;
    //     return await this.connection.manyOrNone(SELECT_ALL);
    //   }

    //   public async selectById(id: number): Promise<any> {
    //     const SELECT_BY_ID = `
    //   SELECT
    //     id,
    //     name,
    //     created,
    //     updated
    //   FROM "project"
    //   WHERE id = $[id]
    // `;
    //     return await this.connection.oneOrNone(SELECT_BY_ID, {id});
    //   }
}
