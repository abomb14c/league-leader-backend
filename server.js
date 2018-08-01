const express = require('express');

const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';

const configuration = require('./knexfile')[environment];

const db = require('knex')(configuration);

const server = express();


server.use(bodyParser.json());

server.post('/users/new', (req, res) => {
  const newUser = req.body;
  // validate required params
  const requiredUserParams = [
    'username',
    'email',
    'password',
  ];

  for (const param of requiredUserParams) {
    if (newUser[param] === undefined) {
      return res.status(422).send('must fill out all inputs to create account');
    }
  }

  db('users')
    .where('username', newUser.username)
    .orWhere('email', newUser.email)
    .then((result) => {
      if (result.length > 0) {
        return res.status(301).send('Account already exists');
      }
      return db('users')
        .insert(newUser, 'id')
        .then(resultId => res.status(201).json({ userId: resultId[0] }));
    });
});

server.post('/users', async (req, res) => {
  const guest = req.body;
  console.log(req.body)
  try {
    const users = await db('users').select();
    const validation = users.find((user) => { 
      return (user.username === guest.username) && (user.password === guest.password);
    });
    console.log(validation)
    res.status(201).json({ username: validation.username, id: validation.id});
  } catch (error) {
    console.log(error);
    res.status(500).json('Incorrect email or password', error);
  }
});

server.post('/league', async (req, res) => {
  const league = req.query;
  console.log(req.query)
  const requiredLeagueParams = [
    'name',
    'league_type',
    'bet',
    'admin',
    'teams',
  ];

  for (const param of requiredLeagueParams) {
    if (league[param] === undefined) {
      return res.status(422).send('your league is not complete!');
    }
  }

  db('league')
    .insert(league, 'id')
    .then( league => {
      res.status(201).json({ id: league[0] })
    })
    .catch(error => {
      res.status(500).json({ error })
    })
})

server.get('/league/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const leagues = await db('league').select();
    const leagueInfo = leagues.filter(league => league.admin === id);
    res.status(200).json(leagueInfo);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.listen(3000, () => console.log('servers running on localhost3000'));
