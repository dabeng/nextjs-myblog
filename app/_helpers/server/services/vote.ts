
import { Vote, Comment } from '../models';
import { IVoteSearchParams } from '@/_services';

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

async function getBySearchParams(params: IVoteSearchParams) {
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
      const temp = comment.upvotes.slice();
      temp.splice(temp.indexOf(sameVote.id), 1);
      Object.assign(comment, { upvotes: temp });
    } else {
      const temp = comment.downvotes.slice();
      temp.splice(temp.indexOf(sameVote.id), 1);
      Object.assign(comment, { downvotes: temp });
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
      const temp1 = comment.downvotes;
      temp1.splice(temp1.indexOf(differentVote.id), 1);
      const temp2 = comment.upvotes;
      temp2.push(differentVote.id);
      Object.assign(comment, {
        downvotes: temp1,
        upvotes: temp2,
      });
    } else {
      const temp1 = comment.upvotes;
      temp1.splice(temp1.indexOf(differentVote.id), 1);
      const temp2 = comment.downvotes;
      temp2.push(differentVote.id);
      Object.assign(comment, {
        upvotes: temp1,
        downvotes: temp2,
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
    const temp = comment.upvotes.slice();
    temp.push(brandnewVote.id);
    Object.assign(comment, {
      upvotes: temp,
    });
  } else {
    const temp = comment.downvotes.slice();
    temp.push(brandnewVote.id);
    Object.assign(comment, {
      downvotes: temp,
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