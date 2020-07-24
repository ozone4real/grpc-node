const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")
const path = require("path")
const PROTO_PATH = path.resolve("app.proto")
const packageDefinition =  protoLoader.loadSync(PROTO_PATH)

const super_heroes_proto =  grpc.loadPackageDefinition(packageDefinition).super_heroes

const client = new super_heroes_proto.SuperHeroes("0.0.0.0:5000", grpc.credentials.createInsecure())

const request = process.argv[2]
const args = process.argv.slice(3)

const apis = {
  addHero() {
    const { name, powers } = args
    client.addHero({name, powers}, (err, res) => {
      if(err) return console.log(err)
      console.log(res)
    })
  },

  getHero() {
    const id = args[0]
    client.getHero({ id }, (err, res) => {
      if(err) return console.log(err)
      console.log(res)
    })
  },

  getAllHeroes() {
    client.getAllHeroes(null, (err, res) => {
      if(err) return console.log(err)
      console.log(res)
    })
  }
}

apis[request]()