const grpc = require('grpc')
const path = require("path")
const protoLoader = require('@grpc/proto-loader')
const fs = require("fs")
const PROTO_PATH = path.resolve("app.proto")
const DB_PATH = __dirname + "heroesdb.json"
const heroes = JSON.parse(fs.readFileSync(DB_PATH))

const packageDefinition = protoLoader.loadSync(PROTO_PATH, { arrays: true })

const super_heroes_proto =  grpc.loadPackageDefinition(packageDefinition).super_heroes

const server = grpc.Server()

const validateHero = (hero) => {
  const { name, powers } = hero
  let error =  null;
  if(!name) error = "There must be a super hero name"
  if(!powers && !powers.length) error = "A super hero must have at least one power"
  return { error }
}

const addHero = (call, callback) => {
  const result = validateHero(call.request)
  if(result.error) return callback({ result })
  heroes.push(call.request)
  fs.writeFileSync(JSON.stringify(heroes))
  callback(null, call.request)
}

server.addService(super_heroes_proto.SuperHeroes.service, { addHero })

server.bind('0.0.0.0:3000', grpc.ServerCredentials.createInsecure())

server.start()

