const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")
const path = require("path")
const PROTO_PATH = path.resolve("app.proto")
const packageDefinition =  protoLoader.loadSync(PROTO_PATH)

const super_heroes_proto =  grpc.loadPackageDefinition(packageDefinition).super_heroes

const client = new super_heroes_proto.SuperHeroes("0.0.0.0:5000", grpc.credentials.createInsecure())

const [ name, ...powers ] = process.argv.slice(2)

client.addHero({name, powers}, (err, res) => {
  if(err) return console.log(err)
  console.log(res)
})