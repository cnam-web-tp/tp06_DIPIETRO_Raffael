import { sequelize } from './sequelize.js'
import { User } from './models/users.js'

export const initDatabase = async () => {
  try {
    await sequelize.authenticate()

    User.sync()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
