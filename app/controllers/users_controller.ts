// import type { HttpContext } from '@adonisjs/core/http'

import { JwtService } from '#services/jwt_service'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  constructor(private readonly jwtService: JwtService) {}

  async login({ request, response }: HttpContext) {
    // validate data
    // const data = await request.validateUsing

    // check username and password in database

    // generate jwt token
    const user = { id: crypto.randomUUID(), username: request.input('username') }
    const jwt = this.jwtService.generateAccessToken(user)

    return response.header('Authorization', jwt).json(user)
  }

  async register({ request, response }: HttpContext) {
    //validate data
    const user = { id: crypto.randomUUID(), username: request.input('username') }
    console.log(request)
    return response.noContent()
  }

  async update({ request, response }: HttpContext) {
    //validate data
    const user = { id: crypto.randomUUID(), username: request.input('username') }

    const jwt = this.jwtService.generateAccessToken(user)
    return response.header('Authorization', jwt).json(user)
  }
}
