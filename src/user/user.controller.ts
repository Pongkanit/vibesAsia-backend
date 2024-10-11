import { Controller, Post, Body, Response } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Response() res,
  ) {
    const { username, password } = body;

    try {
      // Find the user by username and password in the database
      const user = await this.userService.getUser({ username, password });

      if (user) {
        // Store the user's ObjectId in the cookie for better reference
        res.cookie('userId', user._id, { httpOnly: true });
        return res.json({ message: 'Login successful', userId: user._id });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('userId'); // Clear the cookie on logout
    return res.json({ message: 'Logout successful' });
  }
}
