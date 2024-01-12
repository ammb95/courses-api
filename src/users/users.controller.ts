import { Handler } from "express";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./models/users.dtos";
import { HttpStatusCodes } from "../enums/http-status-codes.enum";

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  public create: Handler = async (req, res, next): Promise<void> => {
    const newUser: CreateUserDto = req.body;

    try {
      const createdUser = await this.usersService.create(newUser);
      res.status(HttpStatusCodes.CREATED).json({ user: createdUser }).end();
    } catch (error) {
      next(error);
    }
  };
}
