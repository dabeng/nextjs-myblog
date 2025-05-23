import { Children } from 'react';
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

async function appendSubcomments(parentComments: Array<any>) {
  for await (const pc of parentComments) {
    const childComments = await Comment.find({ parentComment: pc.id })
      .sort([['createdAt', 'asc']])
      .populate('author')
      .populate({
        path: 'upvotes',
        populate: {
          path: 'user'
        }
      })
      .populate({
        path: 'downvotes',
        populate: {
          path: 'user'
        }
      });

    Object.assign(pc, { children: childComments });
    await pc.save();
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
  let data;

    data = await Comment
      .find({ ...queryObj, parentComment: null })
      .sort([[sortFieldName, sortOrder]])
      .populate('author')
      .populate({
        path: 'upvotes',
        populate: {
          path: 'user'
        }
      })
      .populate({
        path: 'downvotes',
        populate: {
          path: 'user'
        }
      })
      .populate('children')
      .skip((params.page - 1) * page_size)
      .limit(page_size);



    // if (sortOrder === 'desc') {
    //   data.sort((a,b) => b.upvotes.length - a.upvotes.length);
    // } else {
    //   data.sort((a,b) => a.upvotes.length - b.upvotes.length);
    // }


  const nestedComments = await appendSubcomments(data);

  return { data: nestedComments, metadata: { total, nextPage: total > params.page * page_size ? params.page + 1 : undefined } };
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