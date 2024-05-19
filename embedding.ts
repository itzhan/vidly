import mongoose, { Schema, Document, Model } from "mongoose";

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

interface Author extends Document {
  name: string;
  bio: string;
  website: string;
}

const authorSchema = new Schema<Author>({
  name: String,
  bio: String,
  website: String,
});

const AuthorModel: Model<Author> = mongoose.model<Author>(
  "Author",
  authorSchema
);

interface Course {
  name: string;
  authors: Author[];
}

const CourseSchema = new Schema<Course>({
  name: String,
  authors: {
    type: [authorSchema],
    required: true,
  },
});

const CourseModel: Model<Course> = mongoose.model<Course>(
  "Course",
  CourseSchema
);

async function createCourse(name: string, authors: Author[]) {
  const course = new CourseModel({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await CourseModel.find();
  console.log(courses);
}

async function addAuthor(courseId: string, newAuthor: Author) {
  const course = await CourseModel.findById(courseId);
  if (!course) return console.log(new Error("id不存在"));

  course.authors.push(newAuthor);
  const newAuthors = await course.save();

  console.log(newAuthors);
}

async function deleteAuthor(courseId: string, authorId: string) {
  const course = await CourseModel.updateOne(
    { _id: courseId },
    { $pull: { authors: { _id: authorId } } }
  );

  console.log(course);
}

// createCourse("Node Course", [
//   new AuthorModel({ name: "Mosh" }),
//   new AuthorModel({ name: "John" }),
// ]);

deleteAuthor("66432eb19da09e98e0e5def6", "664330fd7023aaf41ef3f03e");
