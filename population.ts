import mongoose, { Schema, Document, Model } from 'mongoose';

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

interface Author extends Document {
  name: string;
  bio: string;
  website: string;
}

const AuthorSchema = new Schema<Author>({
  name: String,
  bio: String,
  website: String
});

const AuthorModel: Model<Author> = mongoose.model<Author>('Author', AuthorSchema);

interface Course extends Document {
  name: string;
  author: Author['_id'];
}

const CourseSchema = new Schema<Course>({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
});

const CourseModel: Model<Course> = mongoose.model<Course>('Course', CourseSchema);

async function createAuthor(name: string, bio: string, website: string) { 
  const author = new AuthorModel({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name: string, author: Author['_id']) {
  const course = new CourseModel({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await CourseModel
    .find()
    .populate('author', 'name -_id')
    .select('name author');
  console.log(courses);
}

// createAuthor('Mosh', 'My bio', 'My Website');
// createCourse('Node.js', '66431b3139011043df348f96')
listCourses()


