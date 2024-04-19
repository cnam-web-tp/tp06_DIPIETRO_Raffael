// import type { HttpContext } from '@adonisjs/core/http'

import { User } from '#database/models/users'
import { JwtService } from '#services/jwt_service'
import { registerUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UsersController {
  constructor(private readonly jwtService: JwtService) {}

  async login({ request, response }: HttpContext) {
    // validate data
    // const data = await request.validateUsing

    // check username and password in database

    // generate jwt token
    // const user = { id: crypto.randomUUID(), username: request.input('username') }
    // const jwt = this.jwtService.generateAccessToken(user)

    // return response.header('Authorization', jwt).json(user)
    return response.json({ message: 'login' })
  }

  async register({ request, response }: HttpContext) {
    //validate data
    const data = await request.validateUsing(registerUserValidator)

    try {
      await User.create(data)
      return response.created(data)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async update({ request, response }: HttpContext) {
    //validate data
    const user = { id: crypto.randomUUID(), username: request.input('username') }

    const jwt = this.jwtService.generateAccessToken(user)
    return response.header('Authorization', jwt).json(user)
  }
}
