const grpc = require('grpc')
const path = require("path")
const protoLoader = require('@grpc/proto-loader')
const fs = require("fs")
const PROTO_PATH = path.resolve("app.proto")
const DB_PATH = __dirname + "/heroesdb.json"
const heroes = JSON.parse(fs.readFileSync(DB_PATH))

const packageDefinition = protoLoader.loadSync(PROTO_PATH, { arrays: true })

const super_heroes_proto =  grpc.loadPackageDefinition(packageDefinition).super_heroes

const server = new grpc.Server()

const validateHero = (hero) => {
  const { name, powers } = hero
  validateInput = () => {
    let error =  null;
    if(!name) error = "There must be a super hero name"
    if(!powers || !powers.length) error = "A super hero must have at least one power"
    return error
  }

  ensureUniqueness = () => {
    if(heroes.find((h) => h.name === name)) return `Hero named ${name} already exist`
    return null
  }

  return validateInput() || ensureUniqueness()

}


const addHero = (call, callback) => {
  const hero = call.request
  const error = validateHero(hero)
  if(error) return callback(null, { error })
  hero.id = heroes.length + 1
  heroes.push(hero)
  fs.writeFileSync(DB_PATH, JSON.stringify(heroes))
  callback(null, { hero })
}

const getHero = (call, callback) => {
  const hero = heroes.find((h) => h.id === call.request.id)
  callback(null, { hero })
}

const getAllHeroes = (_, callback) => {
  console.log(heroes)
  callback(null, { heroes })
}

server.addService(super_heroes_proto.SuperHeroes.service, { addHero, getHero, getAllHeroes })

server.bind('0.0.0.0:5000', grpc.ServerCredentials.createInsecure())

server.start()

