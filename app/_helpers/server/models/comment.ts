import { model, models, Schema } from 'mongoose';

export { Comment };

const schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
  content: { type: String },
  vote: { type: String, enum: ['Upvote', 'Downvote'] },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', required: false }
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

const Comment = models.Comment || model('Comment', schema);

