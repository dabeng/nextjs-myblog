import { model, models, Schema } from 'mongoose';

export { Reaction };

const schema = new Schema({
  reaction: { type: String, required: true, enum: ['Upvote', 'Funny', 'Love', 'Surprised', 'Angry', 'Sad'] },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog' }
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

const Reaction = models.Reaction || model('Reaction', schema);

