import { model, models, Schema } from 'mongoose';

export { Comment };

const schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
  content: { type: String },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
  upvoteCount: { type: Number, default: 0 },
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
  downvoteCount: { type: Number, default: 0 },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', required: false },
  children: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  // add createdAt and updatedAt timestamps
  timestamps: true
});

schema.pre('save', function (next) {
  this.upvoteCount = this.upvotes.length;
  this.downvoteCount = this.downvotes.length;
  next();
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
