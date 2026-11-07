import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getUsers, saveUsers, User } from '../models/User';

const JWT_SECRET = 'super_secret_key_change_in_production';

export class UserService {
  public async register(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const users = getUsers();
    const userAlreadyExists = users.find((u) => u.email === email);
    if (userAlreadyExists) {
      throw new Error('Email already registered.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser: User = {
      id: uuidv4(),
      email,
      passwordHash,
    };

    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    return {
      user: { id: newUser.id, email: newUser.email },
      token,
    };
  }

  public async login(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const users = getUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials.');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error('Invalid credentials.');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    return {
      user: { id: user.id, email: user.email },
      token,
    };
  }
}