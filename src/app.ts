import { envs } from './config/envs'
import { MongoDatabase } from './data/mongo-database'
import { AppRoutes } from './presentation/routes'
import { Server } from './presentation/server'

void (async () => {
  await main()
})()

async function main (): Promise<void> {
  await MongoDatabase.connect({
    dbName: '',
    mongoUrl: ''
  })

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes
  })

  await server.start()
}
