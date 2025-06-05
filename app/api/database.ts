import db from "@/lib/db";

export interface UserMeta {
  id: string;
  info: {
    name: string;
    color: string;
    avatar: string;
  };
}

function colorFromEmail(email: string): string {
  const hash = [...email].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  return "#" + (hash & 0xffffff).toString(16).padStart(6, "0");
}

const DEFAULT_AVATAR = "https://liveblocks.io/avatars/avatar-1.png";

export async function getAllUsers(): Promise<UserMeta[]> {
  const users = await db.user.findMany({ select: { email: true, name: true } });
  return users.map((u) => ({
    id: u.email,
    info: {
      name: u.name,
      color: colorFromEmail(u.email),
      avatar: DEFAULT_AVATAR,
    },
  }));
}

export async function getUser(id: string): Promise<UserMeta | undefined> {
  const u = await db.user.findUnique({
    where: { email: id },
    select: { email: true, name: true },
  });
  if (!u) return undefined;
  return {
    id: u.email,
    info: {
      name: u.name,
      color: colorFromEmail(u.email),
      avatar: DEFAULT_AVATAR,
    },
  };
}

export async function getUsers(ids: string[]): Promise<UserMeta[]> {
  const users = await db.user.findMany({
    where: { email: { in: ids } },
    select: { email: true, name: true },
  });
  return users.map((u) => ({
    id: u.email,
    info: {
      name: u.name,
      color: colorFromEmail(u.email),
      avatar: DEFAULT_AVATAR,
    },
  }));
}

export async function getRandomUser(): Promise<UserMeta | undefined> {
  const users = await db.user.findMany({ select: { email: true, name: true } });
  if (users.length === 0) return undefined;
  const u = users[Math.floor(Math.random() * users.length)];
  return {
    id: u.email,
    info: {
      name: u.name,
      color: colorFromEmail(u.email),
      avatar: DEFAULT_AVATAR,
    },
  };
}

