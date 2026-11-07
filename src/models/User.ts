import * as fs from 'fs';
import * as path from 'path';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
}

const filePath = path.join(__dirname, '../data/database.json');

// Função para ler os usuários do arquivo
export function getUsers(): User[] {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileData);
}

// Função para salvar os usuários no arquivo
export function saveUsers(users: User[]): void {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
}