export type AvatarStateType = "existing" | "new" | "deleted";

export const NOT_FOUND_URL = "https://demofree.sirv.com/nope-not-here.jpg";

export type IEmployee = {
  _id: string;
  f_Image: string;
  f_Name: string;
  f_Email: string;
  f_Mobile: string;
  f_Designation: string;
  f_Gender: string;
  f_Course: {
    _id: string;
    f_CourseName: string;
  }[];
  f_CreatedAt: Date;
};

export const navLinks = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  {
    path: "/employees-list",
    name: "EmployeesList",
  },
  {
    path: "/course-list",
    name: "CourseList",
  },
];
