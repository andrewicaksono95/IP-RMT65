import { User } from '../models/User.js';

export async function getProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ id: user.id, email: user.email, fullName: user.fullName, nickName: user.nickName, dateOfBirth: user.dateOfBirth, gender: user.gender });
  } catch (e) { next(e); }
}

export async function updateProfile(req, res, next) {
  try {
    const { fullName, nickName, dateOfBirth, gender } = req.body;
    const user = await User.findByPk(req.user.id);
    if (fullName !== undefined) user.fullName = fullName;
    if (nickName !== undefined) user.nickName = nickName;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    await user.save();
    res.json({ id: user.id, email: user.email, fullName: user.fullName, nickName: user.nickName, dateOfBirth: user.dateOfBirth, gender: user.gender });
  } catch (e) { next(e); }
}
