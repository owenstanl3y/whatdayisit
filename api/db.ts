import {Pool, createPool} from 'mariadb';

class db {
  pool: Pool;

  constructor() {
    const port = parseInt(process.env.DB_PORT || '') || 33061
    this.pool = createPool({
      host: process.env.DB_HOST,
      port: port,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionLimit: 5
    });
    this.dbConnect();
  }

  async executeQuery(query: string) {
    try {
      return await this.pool.query(query);
    } catch(error) { throw error }
  }

  private dbConnect() {
    try {
      this.pool.getConnection();
      console.log('Connected to database');
    } catch(error) {
      console.error(error);
      return;
    }
  }

  async isVaild(token: any): Promise<boolean> {
    const q = `SELECT * FROM tokens WHERE token = "${token}"`;
    return this.executeQuery(q).then(data => {
      return (data[0].token == token);
    }).catch(reason => {
      return false
    });
  }


}

const DB = new db()

export default DB;

