import { IDatabase } from 'pg-promise';
import Config from '../lib/config';
import logger, { Logger } from '../lib/logger';
// import getConnection from '../lib/connection';

export default class ProjectDatasource {
    // private connection: IDatabase<unknown>;
    private tokenCache: any;
    private logger: Logger;

    constructor(config: Config, connection: IDatabase<unknown>) {
        // this.connection = connection || getConnection(config);
        this.tokenCache = {}
        this.logger = logger;
    }

    public setToken(email: string, token: string) {
        this.tokenCache[email] = {
            timestamp: Date.now(),
            token: token,
        }
        this.logger.info('Token Cache');
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
