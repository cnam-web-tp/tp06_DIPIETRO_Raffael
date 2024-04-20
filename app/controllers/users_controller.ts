// import type { HttpContext } from '@adonisjs/core/http'

import { User } from '#database/models/users'
import { JwtService } from '#services/jwt_service'
import { loginUserValidator, registerUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import * as bcrypt from 'bcrypt'

@inject()
export default class UsersController {
  constructor(private readonly jwtService: JwtService) {}

  async login({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginUserValidator)

    // check username and password in database
    const usr = await User.findOne({ where: { login: data.login } })

    const errorMessage = 'Invalid username or password'
    if (!usr) {
      return response.badRequest({ message: errorMessage })
    }

    const isPasswordValid = await bcrypt.compare(data.password, usr.getDataValue('password'))
    if (!isPasswordValid) {
      return response.badRequest({ message: errorMessage })
    }

    // generate jwt token
    const user = { id: usr.getDataValue('userId'), username: request.input('login') }
    const jwt = this.jwtService.generateAccessToken(user)

    return response.header('Authorization', jwt).json({
      ...user,
      token: jwt,
    })
  }

  async register({ request, response }: HttpContext) {
    //validate data
    const data = await request.validateUsing(registerUserValidator)

    try {
      const hashedPassword = await this.hashData(data.password)
      await User.create({ ...data, password: hashedPassword })
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

  async profile({ request, response }: HttpContext) {
    const userId = (request.jwt?.payload as any).id
    const user = await User.findOne({ where: { userId } })
    if (!user) {
      return response.unauthorized()
    }
    // remove the password from the user object
    const { password, ...userData } = user.toJSON()
    return response.json(userData)
  }

  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(data, salt)
  }
}
