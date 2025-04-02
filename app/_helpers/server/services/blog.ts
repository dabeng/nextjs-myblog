import { Blog, User } from '../models';

export const blogService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll() {
  return  await Blog.find().populate('author');
}

async function getById(id: string) {
  try {
    return await Blog.findById(id);
  } catch {
    throw 'blog Not Found';
  }
}

async function create(params: any) {
  const blog = new Blog(params);
  // const author = await User.findById(params.author);
  // blog.author = author;
  await blog.save();
}

async function update(id: string, params: any) {
  const blog = await Blog.findById(id);

  // validate
  if (!blog) throw 'Blog not found';

  // copy params properties to blog
  Object.assign(blog, params);
  const newBlog = await blog.save();
  return newBlog;
}

async function _delete(id: string) {
  await Blog.findByIdAndDelete(id);
}