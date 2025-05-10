import { model, models, Schema } from 'mongoose';

export { Vote };

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
  vote: { type: String, enum: ['Upvote', 'Downvote'] },
}, {
  // add createdAt and updatedAt timestamps
  timestamps: true
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  }
});

const Vote = models.Vote || model('Vote', schema);
