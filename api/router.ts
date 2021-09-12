import { Router, Request, Response } from 'express'
import Cache from "./cache"
import DB from "./db";

const router = Router();
const cache = new Cache(28000);

router.get('/dates/:date', (req, res) => {
  const query = `SELECT * FROM dates WHERE date = "${req.params.date}"`;
  cache.get(query)
    .then(date => {
      if (date[0].length > 1) {
        res.json(date[0])
      } else {
        res.json({'date': req.params.date})
      }
    })
    .catch(error => {
      res.status(402)
      res.json({'date': req.params.date})
    })
});

router.get('/dates', (req, res) => {
  const query = `SELECT * FROM dates`;
  cache.get(query)
    .then(dates => res.json(dates))
    .catch(error => {
      res.status(402)
      res.json(error)
    })
});

router.get('/admin/cache/stats', (req, res) => {
  res.send(cache.dbcache.stats)
});

router.get('/admin/cache/flush', (req, res) => {
  cache.flush()
});

interface DayType {
  date: any
  has_school: boolean
  type: string,
  normal: boolean,
  extra: boolean
  comment: string
}

router.put('/admin/dates/:date', (req, res) => {
  const date = req.body as DayType;
  date.date = req.params.date;
  const q = `INSERT INTO dates (date, type, normal, extra, comment, has_school) VALUES ('${date.date}', '${date.type}', '${date.normal}', '${date.extra}', '${date.comment}', '${date.has_school}')`
  DB.executeQuery(q).then(r => res.json(r));
});

router.post('/admin/dates/:date', (req, res) => {
  const date = req.body as DayType;
  date.date = req.params.date;
  const q = `UPDATE dates t SET type = '${date.type}', normal = '${date.normal}', extra = '${date.extra}', comment = '${date.comment}', has_school = '${date.has_school}' WHERE t.date = '${date.date}' `
  DB.executeQuery(q).then(r => res.json(r));
  cache.dbcache.del('SELECT * FROM dates');
});


router.delete('/admin/dates/:date', (req, res) => {
  const date = req.params.date;
  const q = `DELETE FROM dbtest.dates WHERE date = '${date}'`
  DB.executeQuery(q).then(r => res.json(r));
  cache.dbcache.del('SELECT * FROM dates');
  cache.delFromPart(date);
});

router.get('/admin/tokens/gen', (req, res) => {
  const token = Math.random().toString(36).substr(2, 9);
  const q = `insert into tokens(token) VALUE ('${token}')`
  DB.executeQuery(q).then(r => res.json({log : r, token: token}));
});

router.get('/admin/tokens', (req, res) => {
  const q = 'SELECT * FROM tokens'
  DB.executeQuery(q).then(r => res.json(r));
});

export default router;

