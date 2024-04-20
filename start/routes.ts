/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => 'It works!')
router.get('/profile', [UsersController, 'profile']).use(middleware.jwt())

router
  .group(() => {
    router.post('/register', [UsersController, 'register'])
    router.post('/login', [UsersController, 'login'])
    router.put('/update', [UsersController, 'update'])
  })
  .prefix('auth')
