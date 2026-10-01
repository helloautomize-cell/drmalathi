export type Course = {
  title: string;
  duration: string;
  image: string;
  imageAlt: string;
  confirmed: boolean;
};

// Titles and durations read from the course flyers on the current site.
export const courses: Course[] = [
  {
    title: "Fellowship in Fetal Medicine",
    duration: "1 year",
    image: "/images/courses/course2.webp",
    imageAlt: "Fellowship in Fetal Medicine, 1 year program",
    confirmed: true,
  },
  {
    title: "Advanced Obstetric Ultrasound",
    duration: "6 months",
    image: "/images/courses/course1.webp",
    imageAlt: "Advanced obstetric ultrasound course, 6 months",
    confirmed: true,
  },
  {
    title: "Short Training Courses in Fetal Ultrasound",
    duration: "2 months",
    image: "/images/courses/course3.webp",
    imageAlt: "Short training courses in fetal ultrasound, 2 months",
    confirmed: true,
  },
  {
    // TODO: the site shows a fetal interventions simulator image under courses
    // but no title or duration. Do not render until the client confirms details.
    title: "",
    duration: "",
    image: "/images/courses/fetal-interventions-simulator.webp",
    imageAlt: "Fetal interventions simulator at the centre",
    confirmed: false,
  },
];
