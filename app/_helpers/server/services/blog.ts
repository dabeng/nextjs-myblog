import { Blog } from '../models';
import { IBlogOnePageParams } from '@/_services';

export const blogService = {
  getBySearchParams,
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function getBySearchParams({ page_size = 4, sortFieldName='createdAt', sortOrder = 'desc', ...params}: IBlogOnePageParams) {
  const queryObj = { ...params };
  const excludedFields = ['page', 'sort', 'page_size'];
    excludedFields.forEach((field) => {
      delete queryObj[field];
    });

  const total = await Blog.countDocuments({...queryObj});
  const data =  await Blog.find({...queryObj})
    .skip((params.page - 1) * page_size)
    .limit(page_size)
    .sort([[sortFieldName, sortOrder]])
    .populate('author');

    return {data, metadata: {total} };
}

async function getAll() {
  return await Blog.find().populate('author');
}

async function getById(id: string) {
  try {
    return await Blog.findById(id).populate('author');
  } catch {
    throw 'blog Not Found';
  }
}

async function create(params: any) {
  const blog = new Blog(params);

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