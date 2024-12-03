import EmployeeSlider1 from "assets/svgs/employeeSlider1.svg";
import EmployeeSlider3 from "assets/svgs/employeeSlider3.svg";
import EmployeeSlider4 from "assets/svgs/employeeSlider4.svg";

import jobSlider1 from "assets/images/jobSlider1.png";
import jobSlider2 from "assets/svgs/jobSlider2.svg";
import jobSlider3 from "assets/images/jobSlider3.png";

type TSlideData = {
  svg?: string;
  text: string;
};

export const employeeSlidesData: TSlideData[] = [
  {
    svg: EmployeeSlider1,
    text: "After making a profile, a feed of jobs will be tailored just for your needs. The like and dislike buttons will be at the bottom after scrolling to the end.",
  },
  // {
  //   svg: <EmployeeSlider2 style={styles.slideImage} />,
  //   text: 'If you would like to see more than just a tailored list of jobs based on your experience, change your preferences.',
  // },
  {
    svg: EmployeeSlider3,
    text: `Create your profile in order to be seen by employers. Upload your current resume to auto populate your profile or fill it out manually, it's up to you!`,
  },
  {
    svg: EmployeeSlider4,
    text: `If you like a job and the employer likes you, it's a match! You will be able to connect directly with the employer to see if it is a good fit and set up a time to chat. `,
  },
  {
    text: `To get started, create your profile and get swiping! Or start by browsing some jobs first.`,
  },
];

export const employerSlidesData: TSlideData[] = [
  {
    svg: jobSlider1,
    text: "Keeper is your place to find quality tech talent tailored for you. Simply post a job, review tailored candidates, and like or dislike to view more.",
  },
  {
    svg: jobSlider2,
    text: `Create a job in order to be seen by tech candidates. The information you include here will inform Keeper's algorithm to only show you qualified candidates. No more hassle!`,
  },
  {
    svg: jobSlider3,
    text: `If you and a candidate both like each other, it's a match! You will be able to message each other to further discuss the opportunity`,
  },
  {
    text: `To get started, create a job and get swiping! Or start by browsing some of our highly qualified candidates first.`,
  },
];
