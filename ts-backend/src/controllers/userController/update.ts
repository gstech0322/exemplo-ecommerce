import { Request, Response } from "express";

import UserModel from "../../models/UserModel";
import validateCpf from "../../utils/validateCPF";

export default async function update(req: Request, res: Response) {
  const { id } = req.tokenPayload;
  const { name, email, cpf, currentPassword, newPassword } = req.body;

  if (cpf && validateCpf(cpf) == false)
    return res.status(400).json({ message: "invalid cpf" });

  try {
    let password;
    const user = await UserModel.findOne(id);

    if (!user) return res.status(404).json({ message: "user not found" });

    if (currentPassword && newPassword) {
      if (await user.checkPassword(currentPassword)) {
        password = newPassword;
      } else {
        return res.status(400).json({ message: "wrong current password" });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (cpf) user.cpf = cpf;
    if (password) user.password = password;

    await user.save();

    return res.json(user);
  } catch (error) {
    console.error(new Date().toUTCString(), "-", error);
    res.status(500).json({ message: "internal error" });
  }
}
