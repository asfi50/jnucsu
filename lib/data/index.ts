import { StudentLeader, User } from "../types";
import { BlogPost } from "../types/blogs.types";
import {
  generateAvatar,
  generateCandidateImage,
  generatePlaceholderImage,
} from "../utils";

// Dummy users
export const dummyUsers: User[] = [
  {
    id: "1",
    name: "Mahmuda Akter",
    avatar: generateAvatar("Mahmuda Akter"),
    email: "mahmuda@jnu.ac.bd",
  },
  {
    id: "2",
    name: "Rafiqul Islam",
    avatar: generateAvatar("Rafiqul Islam"),
    email: "rafiq@jnu.ac.bd",
  },
  {
    id: "3",
    name: "Shahida Begum",
    avatar: generateAvatar("Shahida Begum"),
    email: "shahida@jnu.ac.bd",
  },
];

// Dummy student leaders
export const dummyLeaders: StudentLeader[] = [
  {
    id: "1",
    name: "Ashfaqul Islam Asif",
    title: "Vice President - JnUCSU",
    description:
      "Passionate about student rights and digital innovation. Leading initiatives for better campus facilities and technology integration.",
    avatar: generateCandidateImage("Ashfaqul Islam Asif", 0),
    university: "Jagannath University",
    department: "Computer Science & Engineering",
    year: 4,
    studentId: "CSE-2021-001",
    futurePlans:
      "After graduation, I plan to pursue a career in software development while continuing to advocate for student rights. I aim to establish a tech startup focused on educational solutions and mentor future student leaders.",
    workGallery: [
      generatePlaceholderImage(600, 400, "Campus Tech Initiative"),
      generatePlaceholderImage(600, 400, "Student Welfare Program"),
      generatePlaceholderImage(600, 400, "Leadership Workshop"),
      generatePlaceholderImage(600, 400, "Community Outreach"),
    ],
    votes: 247,
    comments: [
      {
        id: "1",
        author: dummyUsers[0],
        content: "Great leadership qualities! Keep up the excellent work.",
        createdAt: "2024-01-15T10:30:00Z",
        replies: [],
      },
    ],
    tags: ["Leadership", "Technology", "Innovation"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Fatima Rahman",
    title: "General Secretary - JnUCSU",
    description:
      "Dedicated to improving student welfare and organizing impactful events for the university community.",
    avatar: generateCandidateImage("Fatima Rahman", 1),
    university: "Jagannath University",
    department: "English",
    year: 3,
    studentId: "ENG-2022-045",
    futurePlans:
      "I aspire to work in international development and education policy. My goal is to create programs that bridge educational gaps and empower students from diverse backgrounds to achieve their potential.",
    workGallery: [
      generatePlaceholderImage(600, 400, "Cultural Event Organization"),
      generatePlaceholderImage(600, 400, "Student Welfare Campaign"),
      generatePlaceholderImage(600, 400, "Academic Support Program"),
      generatePlaceholderImage(600, 400, "International Relations"),
    ],
    votes: 189,
    comments: [
      {
        id: "2",
        author: dummyUsers[1],
        content: "Amazing organizational skills and always supportive!",
        createdAt: "2024-01-14T15:20:00Z",
        replies: [],
      },
    ],
    tags: ["Organization", "Student Welfare", "Events"],
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-14T15:20:00Z",
  },
  {
    id: "3",
    name: "Mohammad Hassan",
    title: "President - JnUCSU",
    description:
      "Working towards creating a better academic environment and strengthening student-administration relationships.",
    avatar: generateCandidateImage("Mohammad Hassan", 2),
    university: "Jagannath University",
    department: "Political Science",
    year: 4,
    studentId: "POL-2021-012",
    futurePlans:
      "My vision extends beyond university life to public service and policy making. I plan to pursue graduate studies in public administration and work towards creating policies that benefit the education system nationwide.",
    workGallery: [
      generatePlaceholderImage(600, 400, "Student Government Reform"),
      generatePlaceholderImage(600, 400, "Academic Excellence Initiative"),
      generatePlaceholderImage(600, 400, "Policy Development Workshop"),
      generatePlaceholderImage(600, 400, "University Partnership Program"),
    ],
    votes: 312,
    comments: [
      {
        id: "3",
        author: dummyUsers[2],
        content:
          "True leader with vision and dedication. Proud to have you represent us!",
        createdAt: "2024-01-13T09:45:00Z",
        replies: [
          {
            id: "4",
            author: dummyUsers[0],
            content: "Absolutely agree! Great representation.",
            createdAt: "2024-01-13T10:15:00Z",
            replies: [],
          },
        ],
      },
    ],
    tags: ["Leadership", "Administration", "Academic Excellence"],
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-13T10:15:00Z",
  },
  {
    id: "4",
    name: "Nusrat Jahan",
    title: "Cultural Secretary - JnUCSU",
    description:
      "Promoting arts, culture, and creative expression among students through various programs and competitions.",
    avatar: generateCandidateImage("Nusrat Jahan", 3),
    university: "Jagannath University",
    department: "Fine Arts",
    year: 2,
    studentId: "FA-2023-078",
    futurePlans:
      "I dream of establishing a cultural center that promotes Bengali heritage while embracing global artistic expressions. My goal is to become a cultural ambassador and create platforms for young artists to showcase their talents.",
    workGallery: [
      generatePlaceholderImage(600, 400, "Art Exhibition Curation"),
      generatePlaceholderImage(600, 400, "Cultural Festival Management"),
      generatePlaceholderImage(600, 400, "Student Art Competition"),
      generatePlaceholderImage(600, 400, "Traditional Dance Workshop"),
    ],
    votes: 156,
    comments: [],
    tags: ["Arts", "Culture", "Creativity"],
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "Abdullah Al Mamun",
    title: "Sports Secretary - JnUCSU",
    description:
      "Encouraging sports participation and organizing tournaments to promote healthy competition and fitness.",
    avatar: generateCandidateImage("Abdullah Al Mamun", 4),
    university: "Jagannath University",
    department: "Physical Education",
    year: 3,
    studentId: "PE-2022-033",
    futurePlans:
      "I aspire to become a sports administrator and develop youth athletic programs. My plan is to establish sports academies that identify and nurture young talent while promoting physical fitness as a lifestyle.",
    workGallery: [
      generatePlaceholderImage(600, 400, "Inter-University Tournament"),
      generatePlaceholderImage(600, 400, "Fitness Awareness Campaign"),
      generatePlaceholderImage(600, 400, "Sports Equipment Drive"),
      generatePlaceholderImage(600, 400, "Athletic Training Program"),
    ],
    votes: 134,
    comments: [],
    tags: ["Sports", "Fitness", "Competition"],
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "6",
    name: "Sadia Sultana",
    title: "Social Welfare Secretary - JnUCSU",
    description:
      "Working to improve student social welfare and community engagement through various support programs.",
    avatar: generateCandidateImage("Sadia Sultana", 5),
    university: "Jagannath University",
    department: "Social Work",
    year: 2,
    studentId: "SW-2023-045",
    futurePlans:
      "I plan to work with NGOs and social organizations to create impactful community development programs after graduation.",
    workGallery: [
      generatePlaceholderImage(600, 400, "Community Outreach Program"),
      generatePlaceholderImage(600, 400, "Student Support Initiative"),
      generatePlaceholderImage(600, 400, "Social Welfare Drive"),
      generatePlaceholderImage(600, 400, "Mental Health Awareness"),
    ],
    votes: 98,
    comments: [],
    tags: ["Social Work", "Community", "Welfare"],
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "7",
    name: "Rakib Hasan",
    title: "Environment Secretary - JnUCSU",
    description:
      "Promoting environmental sustainability and green initiatives across the university campus.",
    avatar: generateCandidateImage("Rakib Hasan", 0),
    university: "Jagannath University",
    department: "Environmental Science",
    year: 3,
    studentId: "ENV-2022-012",
    futurePlans:
      "I aim to become an environmental policy maker and work on climate change mitigation strategies at the national level.",
    workGallery: [
      generatePlaceholderImage(600, 400, "Campus Tree Plantation"),
      generatePlaceholderImage(600, 400, "Waste Management Initiative"),
      generatePlaceholderImage(600, 400, "Green Energy Project"),
      generatePlaceholderImage(600, 400, "Environmental Awareness Campaign"),
    ],
    votes: 176,
    comments: [],
    tags: ["Environment", "Sustainability", "Green"],
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "8",
    name: "Tamanna Akter",
    title: "Publication Secretary - JnUCSU",
    description:
      "Managing university publications and promoting literary activities among students.",
    avatar: generateCandidateImage("Tamanna Akter", 1),
    university: "Jagannath University",
    department: "Journalism",
    year: 4,
    studentId: "JRN-2021-087",
    futurePlans:
      "I want to become a renowned journalist and establish a media house that focuses on educational journalism.",
    workGallery: [
      generatePlaceholderImage(600, 400, "University Magazine"),
      generatePlaceholderImage(600, 400, "Literary Event"),
      generatePlaceholderImage(600, 400, "Student Newsletter"),
      generatePlaceholderImage(600, 400, "Writing Workshop"),
    ],
    votes: 203,
    comments: [],
    tags: ["Media", "Writing", "Publication"],
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
  {
    id: "9",
    name: "Md. Karim Rahman",
    title: "Religious Affairs Secretary - JnUCSU",
    description:
      "Organizing religious and cultural programs while promoting interfaith harmony among students.",
    avatar: generateCandidateImage("Md. Karim Rahman", 2),
    university: "Jagannath University",
    department: "Islamic Studies",
    year: 2,
    studentId: "IS-2023-021",
    futurePlans:
      "I aspire to become a religious scholar and work towards promoting peace and understanding between different communities.",
    workGallery: [
      generatePlaceholderImage(600, 400, "Interfaith Dialogue"),
      generatePlaceholderImage(600, 400, "Religious Festival"),
      generatePlaceholderImage(600, 400, "Community Prayer"),
      generatePlaceholderImage(600, 400, "Cultural Exchange"),
    ],
    votes: 87,
    comments: [],
    tags: ["Religion", "Culture", "Harmony"],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "10",
    name: "Ruma Begum",
    title: "Assistant General Secretary - JnUCSU",
    description:
      "Supporting administrative activities and coordinating between different student committees.",
    avatar: generateCandidateImage("Ruma Begum", 3),
    university: "Jagannath University",
    department: "Public Administration",
    year: 3,
    studentId: "PA-2022-054",
    futurePlans:
      "I plan to join the civil service and work in public administration to serve the nation effectively.",
    workGallery: [
      generatePlaceholderImage(600, 400, "Administrative Meeting"),
      generatePlaceholderImage(600, 400, "Committee Coordination"),
      generatePlaceholderImage(600, 400, "Student Assembly"),
      generatePlaceholderImage(600, 400, "Policy Discussion"),
    ],
    votes: 145,
    comments: [],
    tags: ["Administration", "Coordination", "Management"],
    createdAt: "2024-01-18T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
];

// Dummy blog posts
export const dummyBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Student Leadership in Digital Age",
    content: "As we navigate through the digital transformation...",
    excerpt:
      "Exploring how technology is reshaping student leadership and engagement in universities.",
    author: dummyUsers[0],
    coverImage: generatePlaceholderImage(800, 400, "Digital Leadership"),
    tags: ["Leadership", "Technology", "Future"],
    publishedAt: "2024-01-10T08:00:00Z",
    readTime: 5,
    likes: 42,
    is_reacted: false,
  },
  {
    id: "2",
    title: "Building Stronger University Communities",
    content: "Community building is at the heart of student success...",
    excerpt:
      "Strategies for creating inclusive and supportive university environments.",
    author: dummyUsers[1],
    coverImage: generatePlaceholderImage(800, 400, "Community Building"),
    tags: ["Community", "Inclusion", "Support"],
    publishedAt: "2024-01-08T12:30:00Z",
    readTime: 7,
    likes: 28,
    is_reacted: false,
  },
  {
    id: "3",
    title: "Sustainable Campus Initiatives",
    content: "Environmental responsibility starts with us...",
    excerpt:
      "How student leaders can drive sustainability initiatives on campus.",
    author: dummyUsers[2],
    coverImage: generatePlaceholderImage(800, 400, "Sustainability"),
    tags: ["Environment", "Sustainability", "Campus"],
    publishedAt: "2024-01-06T14:15:00Z",
    readTime: 6,
    likes: 35,
    is_reacted: false,
  },
];
