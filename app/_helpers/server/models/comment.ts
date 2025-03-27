import { model, models, Schema } from 'mongoose';

export { Comment };

const schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' }
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

const Comment = models.User || model('Comment', schema);

