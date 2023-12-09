import express from 'express'
import cors from 'cors'
import type { Router } from 'express'
import { envs } from '../config/envs'

interface Options {
  port: number
  routes: Router
}

export class Server {
  public readonly app = express()
  private serverListener?: any
  private readonly port: number
  private readonly routes: Router

  constructor (options: Options) {
    const { port, routes } = options
    this.port = port
    this.routes = routes

    this.configure()
  }

  private configure (): void {
    this.app.use(cors({ origin: envs.CLIENT_URL }))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    this.app.get(/^\/(?!api).*/, (req, res) => {
      res.send('Not found')
    })
  }

  async start (): Promise<void> {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    this.app.use(this.routes)

    this.app.get(/^\/(?!api).*/, (req, res) => {
      res.send('Not found')
    })

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`)
    })
  }

  public close (): void {
    this.serverListener?.close()
  }
}
