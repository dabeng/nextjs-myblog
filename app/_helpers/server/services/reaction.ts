
import bcrypt from 'bcryptjs';
import { Reaction } from '../models';
import { IReactionParams } from '@/_services';

export const reactionService = {
  getAll,
  getById,
  getBySearchParams,
  create,
  update,
  delete: _delete
};

async function getAll() {
  return await Reaction.find();
}

async function getById(id: string) {
  try {
    return await Reaction.findById(id);
  } catch {
    throw 'Reaction Not Found';
  }
}

async function getBySearchParams(params: IReactionParams) {
  return await Reaction.find(params);
}

async function create(params: any) {
  // validate
  if (await Reaction.findOne({ username: params.username })) {
    throw 'Username "' + params.username + '" is already taken';
  }

  const user = new Reaction(params);

  // hash password
  if (params.password) {
    user.hash = bcrypt.hashSync(params.password, 10);
  }

  // save user
  await user.save();
}

async function update(id: string, params: any) {
  const user = await Reaction.findById(id);

  // validate
  if (!user) throw 'User not found';
  // 如果“新用户名(params.username)”已经存在，被人使用了
  if (user.username !== params.username && await Reaction.findOne({ username: params.username })) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = bcrypt.hashSync(params.password, 10);
  }

  // copy params properties to user
  Object.assign(user, params);
  const newUser = await user.save();
  return newUser;
}

async function _delete(id: string) {
  await Reaction.findByIdAndDelete(id);
}