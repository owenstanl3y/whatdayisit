import { Router, Request, Response } from 'express'
import Cache from "./cache"
import DB from "./db";

const router = Router();
const cache = new Cache(28000);

router.get('/dates/:date', (req, res) => {
  const query = `SELECT * FROM dates WHERE date = "${req.params.date}"`;
  cache.get(query)
    .then(date => {
      if (date[0]) {
        res.json(date[0])
      } else {
        guessDay(new Date(req.params.date)).then(d => res.json(d))
      }
    })
    .catch(error => {
      console.log(error)
      res.status(402)
      res.json(error)
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

async function guessDay(date: Date): Promise<DayType> {
  if (date.getDay() > 5) {
    return {
      comment: '',
      date: date.toISOString().substring(0, 10),
      extra: false,
      has_school: false,
      normal: true,
      type: '',
    }
  }
  const query = `SELECT * FROM dates WHERE has_school=1 AND normal=1 ORDER BY date DESC LIMIT 1`;
  let d = await cache.get(query).then(date => date[0]) as DayType;
  d.extra = true;
  d.comment = `This is a guess, using data from the last known date`;
  d.type = d.type = "even" ? "odd" : "even";
  d.date = date.toISOString().substring(0, 10);
  return d



}

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
