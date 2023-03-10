import { Request, Response } from "express";

import UserModel from "../../models/UserModel";

export default async function list(req: Request, res: Response) {
  try {
    const users = await UserModel.find({
      select: ["id", "name", "email", "cpf", "admin"],
    });

    return res.json(users);
  } catch (error) {
    console.error(new Date().toUTCString(), "-", error);
    return res.status(500).json({ error: "error finding users" });
  }
}
