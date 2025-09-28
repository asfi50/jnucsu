import { StudentLeader, BlogPost, User } from '../types';
import { generateAvatar, generateCandidateImage, generatePlaceholderImage } from '../utils';

// Dummy users
export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Mahmuda Akter',
    avatar: generateAvatar('Mahmuda Akter'),
    email: 'mahmuda@jnu.ac.bd'
  },
  {
    id: '2',
    name: 'Rafiqul Islam',
    avatar: generateAvatar('Rafiqul Islam'),
    email: 'rafiq@jnu.ac.bd'
  },
  {
    id: '3',
    name: 'Shahida Begum',
    avatar: generateAvatar('Shahida Begum'),
    email: 'shahida@jnu.ac.bd'
  }
];

// Dummy student leaders
export const dummyLeaders: StudentLeader[] = [
  {
    id: '1',
    name: 'Ashfaqul Islam Asif',
    title: 'Vice President - JnUCSU',
    description: 'Passionate about student rights and digital innovation. Leading initiatives for better campus facilities and technology integration.',
    avatar: generateCandidateImage('Ashfaqul Islam Asif', 0),
    university: 'Jagannath University',
    department: 'Computer Science & Engineering',
    year: 4,
    studentId: 'CSE-2021-001',
    futurePlans: 'After graduation, I plan to pursue a career in software development while continuing to advocate for student rights. I aim to establish a tech startup focused on educational solutions and mentor future student leaders.',
    workGallery: [
      generatePlaceholderImage(600, 400, 'Campus Tech Initiative'),
      generatePlaceholderImage(600, 400, 'Student Welfare Program'),
      generatePlaceholderImage(600, 400, 'Leadership Workshop'),
      generatePlaceholderImage(600, 400, 'Community Outreach')
    ],
    votes: 247,
    comments: [
      {
        id: '1',
        author: dummyUsers[0],
        content: 'Great leadership qualities! Keep up the excellent work.',
        createdAt: '2024-01-15T10:30:00Z',
        replies: []
      }
    ],
    tags: ['Leadership', 'Technology', 'Innovation'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Fatima Rahman',
    title: 'General Secretary - JnUCSU',
    description: 'Dedicated to improving student welfare and organizing impactful events for the university community.',
    avatar: generateCandidateImage('Fatima Rahman', 1),
    university: 'Jagannath University',
    department: 'English',
    year: 3,
    studentId: 'ENG-2022-045',
    futurePlans: 'I aspire to work in international development and education policy. My goal is to create programs that bridge educational gaps and empower students from diverse backgrounds to achieve their potential.',
    workGallery: [
      generatePlaceholderImage(600, 400, 'Cultural Event Organization'),
      generatePlaceholderImage(600, 400, 'Student Welfare Campaign'),
      generatePlaceholderImage(600, 400, 'Academic Support Program'),
      generatePlaceholderImage(600, 400, 'International Relations')
    ],
    votes: 189,
    comments: [
      {
        id: '2',
        author: dummyUsers[1],
        content: 'Amazing organizational skills and always supportive!',
        createdAt: '2024-01-14T15:20:00Z',
        replies: []
      }
    ],
    tags: ['Organization', 'Student Welfare', 'Events'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    name: 'Mohammad Hassan',
    title: 'President - JnUCSU',
    description: 'Working towards creating a better academic environment and strengthening student-administration relationships.',
    avatar: generateCandidateImage('Mohammad Hassan', 2),
    university: 'Jagannath University',
    department: 'Political Science',
    year: 4,
    studentId: 'POL-2021-012',
    futurePlans: 'My vision extends beyond university life to public service and policy making. I plan to pursue graduate studies in public administration and work towards creating policies that benefit the education system nationwide.',
    workGallery: [
      generatePlaceholderImage(600, 400, 'Student Government Reform'),
      generatePlaceholderImage(600, 400, 'Academic Excellence Initiative'),
      generatePlaceholderImage(600, 400, 'Policy Development Workshop'),
      generatePlaceholderImage(600, 400, 'University Partnership Program')
    ],
    votes: 312,
    comments: [
      {
        id: '3',
        author: dummyUsers[2],
        content: 'True leader with vision and dedication. Proud to have you represent us!',
        createdAt: '2024-01-13T09:45:00Z',
        replies: [
          {
            id: '4',
            author: dummyUsers[0],
            content: 'Absolutely agree! Great representation.',
            createdAt: '2024-01-13T10:15:00Z',
            replies: []
          }
        ]
      }
    ],
    tags: ['Leadership', 'Administration', 'Academic Excellence'],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-13T10:15:00Z'
  },
  {
    id: '4',
    name: 'Nusrat Jahan',
    title: 'Cultural Secretary - JnUCSU',
    description: 'Promoting arts, culture, and creative expression among students through various programs and competitions.',
    avatar: generateCandidateImage('Nusrat Jahan', 3),
    university: 'Jagannath University',
    department: 'Fine Arts',
    year: 2,
    studentId: 'FA-2023-078',
    futurePlans: 'I dream of establishing a cultural center that promotes Bengali heritage while embracing global artistic expressions. My goal is to become a cultural ambassador and create platforms for young artists to showcase their talents.',
    workGallery: [
      generatePlaceholderImage(600, 400, 'Art Exhibition Curation'),
      generatePlaceholderImage(600, 400, 'Cultural Festival Management'),
      generatePlaceholderImage(600, 400, 'Student Art Competition'),
      generatePlaceholderImage(600, 400, 'Traditional Dance Workshop')
    ],
    votes: 156,
    comments: [],
    tags: ['Arts', 'Culture', 'Creativity'],
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Abdullah Al Mamun',
    title: 'Sports Secretary - JnUCSU',
    description: 'Encouraging sports participation and organizing tournaments to promote healthy competition and fitness.',
    avatar: generateCandidateImage('Abdullah Al Mamun', 4),
    university: 'Jagannath University',
    department: 'Physical Education',
    year: 3,
    studentId: 'PE-2022-033',
    futurePlans: 'I aspire to become a sports administrator and develop youth athletic programs. My plan is to establish sports academies that identify and nurture young talent while promoting physical fitness as a lifestyle.',
    workGallery: [
      generatePlaceholderImage(600, 400, 'Inter-University Tournament'),
      generatePlaceholderImage(600, 400, 'Fitness Awareness Campaign'),
      generatePlaceholderImage(600, 400, 'Sports Equipment Drive'),
      generatePlaceholderImage(600, 400, 'Athletic Training Program')
    ],
    votes: 134,
    comments: [],
    tags: ['Sports', 'Fitness', 'Competition'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  }
];

// Dummy blog posts
export const dummyBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Student Leadership in Digital Age',
    content: 'As we navigate through the digital transformation...',
    excerpt: 'Exploring how technology is reshaping student leadership and engagement in universities.',
    author: dummyUsers[0],
    coverImage: generatePlaceholderImage(800, 400, 'Digital Leadership'),
    tags: ['Leadership', 'Technology', 'Future'],
    publishedAt: '2024-01-10T08:00:00Z',
    readTime: 5,
    likes: 42
  },
  {
    id: '2',
    title: 'Building Stronger University Communities',
    content: 'Community building is at the heart of student success...',
    excerpt: 'Strategies for creating inclusive and supportive university environments.',
    author: dummyUsers[1],
    coverImage: generatePlaceholderImage(800, 400, 'Community Building'),
    tags: ['Community', 'Inclusion', 'Support'],
    publishedAt: '2024-01-08T12:30:00Z',
    readTime: 7,
    likes: 28
  },
  {
    id: '3',
    title: 'Sustainable Campus Initiatives',
    content: 'Environmental responsibility starts with us...',
    excerpt: 'How student leaders can drive sustainability initiatives on campus.',
    author: dummyUsers[2],
    coverImage: generatePlaceholderImage(800, 400, 'Sustainability'),
    tags: ['Environment', 'Sustainability', 'Campus'],
    publishedAt: '2024-01-06T14:15:00Z',
    readTime: 6,
    likes: 35
  }
];