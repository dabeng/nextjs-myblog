import { model, models, Schema } from 'mongoose';

export { User };

const schema = new Schema({
  username: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, default: 'user' },
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  // add createdAt and updatedAt timestamps
  timestamps: true
});

// TODO: wait to enable
// schema.virtual('fullName')
//   .get(function() { return `${this.firstName} ${this.lastName}`; });

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.hash;
  }
});

const User = models.User || model('User', schema);

