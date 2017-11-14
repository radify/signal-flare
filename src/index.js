const { map, pipe, prop, propEq, reject, merge } = require('ramda');
const http = require('http'),
      arp  = require('arpjs'),
      faye = require('faye'),
      fs   = require('fs'),
      expr = require('express'),
      axios = require('axios'),
      parser = require('body-parser');

const { fromCallback } = require('./promise');
const { identity } = require('./identity');

const app = expr();
const json = res => res.json.bind(res);
app.use(parser.json());

const bayeux = new faye.NodeAdapter({ mount: '/s', timeout: 45 });
const server = http.createServer(app);

let localPeers = fromCallback(arp.table.bind(arp));

app.get('/', (req, res) => res.format({
  html: () => res.send(fs.readFileSync('static/index.html').toString()),
  json: () => res.json({
    _links: {
      self: { href: '/' },
      identity: { href: '/identity' },
      status: { href: '/status' },
      peers: { href: '/peers' }
    }
  })
}));

app.get('/identity', (req, res) => identity.then(json(res)));
app.get('/peers', (req, res) => localPeers
  .then(peers => Promise.all(
    peers.map(
      ({ ip }) => axios({ url: `http://${ip}:3113/identity`, timeout: 2500 })
        .then(pipe(prop('data'), merge({ ip })))
        .catch(e => ({ status: 'rejected', err: e && e.message }))
    )
  ))
  .then(pipe(reject(propEq('status', 'rejected')), json(res)))
  .catch(e => res.json({ message: e.message }))
);
app.get('/status', (req, res) => res.json({ ok: true }));

bayeux.attach(server);
server.listen(3113, '0.0.0.0');
