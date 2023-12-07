import mongoose from 'mongoose'

interface Options {
  mongoUrl: string
  dbName: string
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MongoDatabase {
  static async connect (options: Options): Promise<boolean> {
    const { mongoUrl, dbName } = options

    try {
      await mongoose.connect(mongoUrl, { dbName })
      console.log('Mongo connected')

      return true
    } catch (error) {
      console.log('Mongo connection error: ', error)
      throw error
    }
  }
}
