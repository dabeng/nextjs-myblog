
import { Vote, Comment } from '../models';
import { IVoteParams } from '@/_services';

export const voteService = {
  getAll,
  getById,
  getBySearchParams,
  create,
  update,
  delete: _delete
};

async function getAll() {
  return await Vote.find();
}

async function getById(id: string) {
  try {
    return await Vote.findById(id);
  } catch {
    throw 'Reaction Not Found';
  }
}

async function getBySearchParams(params: IVoteParams) {
  return await Vote.find(params);
}

async function create(params: any) {
  // if user has submitted the same vote
  const sameVote = await Vote.findOne(params);
  if (sameVote) {
    // cancel the original same vote
    await Vote.findByIdAndDelete(sameVote.id);
    // remove the upvote or downvote from Comment Model
    const comment = await Comment.findById(params.comment);
    if (sameVote.vote === 'Upvote') {
      Object.assign(comment, { upvotes: comment.upvotes.splice(comment.upvotes.indexOf(sameVote.id), 1) });
    } else {
      Object.assign(comment, { downvotes: comment.downvotes.splice(comment.downvotes.indexOf(sameVote.id), 1) });
    }
    await comment.save();

    return;
  }

  // if user has submitted the different vote
  const differentVote = await Vote.findOne({ user: params.user, comment: params.comment });
  if (differentVote) {
    Object.assign(differentVote, params);
    await differentVote.save();
    // add/remove the upvote or downvote of Comment Model
    const comment = await Comment.findById(params.comment);
    if (differentVote.vote === 'Upvote') {
      Object.assign(comment, {
        downvotes: comment.downvotes.splice(comment.downvotes.indexOf(differentVote.id), 1),
        upvotes: comment.upvotes.push(differentVote.id),
      });
    } else {
      Object.assign(comment, {
        upvotes: comment.upvotes.splice(comment.downvotes.indexOf(differentVote.id), 1),
        downvotes: comment.downvotes.push(differentVote.id),
      });
    }
    await comment.save();

    return;
  }

  // save the brand new vote
  const brandnewVote = new Vote(params);
  await brandnewVote.save();
  // add the upvote or downvote
  const comment = await Comment.findById(params.comment);
  if (brandnewVote.vote === 'Upvote') {
    Object.assign(comment, {
      upvotes: comment.upvotes.push(brandnewVote.id),
    });
  } else {
    Object.assign(comment, {
      downvotes: comment.downvotes.push(brandnewVote.id),
    });
  }
  await comment.save();
}

async function update(id: string, params: any) {
  const vote = await Vote.findById(id);

  // validate
  if (!vote) throw 'Vote not found';

  // copy params properties to vote
  Object.assign(vote, params);
  const newVote = await vote.save();
  return newVote;
}

async function _delete(id: string) {
  await Vote.findByIdAndDelete(id);
}