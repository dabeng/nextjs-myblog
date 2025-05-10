import { Comment } from '../models';
import { IComment, ICommentOnePageParams } from '@/_services';

export const commentService = {
  getBySearchParams,
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function appendSubcomments(parentComments: Array<IComment>) {
  for await (const p of parentComments) {
    const data = await Comment.find({ parentComment: p.id })
      .sort([['createdAt', 'asc']])
      .populate('author')
      .populate('votes')
      .lean();

    if (data.length !== 0) {
      for (const c of data) {
        c.id = c._id;
      }
      p.children = data;
    }
  }

  return parentComments;
}

async function getBySearchParams({ page_size = 4, sortFieldName = 'createdAt', sortOrder = 'desc', ...params }: ICommentOnePageParams) {
  const queryObj = { ...params };
  const excludedFields = ['page', 'page_size', 'sortFieldName', 'sortOrder'];
  excludedFields.forEach((field) => {
    delete queryObj[field];
  });

  const total = await Comment.countDocuments({ ...queryObj, parentComment: null });
  const data = await Comment.find({ ...queryObj, parentComment: null })
    .skip((params.page - 1) * page_size)
    .limit(page_size)
    .sort([[sortFieldName, sortOrder]])
    .populate('author')
    .populate('votes')
    .lean();

  for (const c of data) {
    c.id = c._id;
  }

  const nestedComments = await appendSubcomments(data);

  return { data: nestedComments, metadata: { total } };
}

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