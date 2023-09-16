import { Request } from 'express';
import { User } from 'src/users/user.schema';

export type RequestWithUser = Request & {
  user: User & { id: string };
};
