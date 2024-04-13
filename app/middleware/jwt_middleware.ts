import { JwtService } from '#services/jwt_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class JwtMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async handle({ request, response }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const token = request.header('authorization')

    try {
      if (!token) {
        throw new Error('Token not provided')
      }
      request.jwt = this.jwtService.verifyJwt(token)
    } catch (error) {
      request.jwt = undefined
      return response.unauthorized({ message: 'Missing or invalid token' })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
