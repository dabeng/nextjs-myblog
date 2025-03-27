import { Comment } from '../models';

export const commentService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll() {
  return await Comment.find();
}

async function getById(id: string) {
  try {
    return await Comment.findById(id);
  } catch {
    throw 'Comment Not Found';
  }
}

async function create(params: any) {
  const comment = new Comment(params);
  await comment.save();
}

async function update(id: string, params: any) {
  const comment = await Comment.findById(id);

  // validate
  if (!comment) throw 'Blog not found';

  // copy params properties to comment
  Object.assign(comment, params);
  const newComment = await comment.save();
  return newComment;
}

async function _delete(id: string) {
  await Comment.findByIdAndDelete(id);
}