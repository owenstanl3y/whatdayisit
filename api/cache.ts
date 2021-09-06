import NodeCache, {Stats} from 'node-cache';
import DB from "./db";

//onst dbcache = new NodeCache({ stdTTL: 28000, checkperiod: 5000, useClones: false } )


class Cache {

  dbcache: NodeCache

  constructor(ttlSeconds: number) {
    this.dbcache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
  }

  get(q: string): Promise<any> {
    const value = this.dbcache.get(q);
    if (value) {
      return Promise.resolve(value);
    }
    return DB.executeQuery(q)
      .then((row) => {
        if (q.includes("SELECT")) this.dbcache.set(q, row)
        return row
      });
  }

  getStats(): Stats {
    return this.dbcache.getStats()
  }

  flush() {
    this.dbcache.flushAll();
  }

  delFromPart(startStr = '') {
    if (!startStr) {
      return;
    }

    const keys = this.dbcache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.dbcache.del(key);
      }
    }
  }

}


export default Cache;
