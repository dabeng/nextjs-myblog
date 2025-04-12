import { model, models, Schema } from 'mongoose';

export { Blog };

const schema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
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

const Blog = models.Blog || model('Blog', schema);

