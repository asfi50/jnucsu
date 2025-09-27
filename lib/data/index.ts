import { StudentLeader, BlogPost, User } from '../types';
import { generateAvatar, generatePlaceholderImage } from '../utils';

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
    avatar: generateAvatar('Ashfaqul Islam Asif'),
    university: 'Jagannath University',
    department: 'Computer Science & Engineering',
    year: 4,
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
    avatar: generateAvatar('Fatima Rahman'),
    university: 'Jagannath University',
    department: 'English',
    year: 3,
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
    avatar: generateAvatar('Mohammad Hassan'),
    university: 'Jagannath University',
    department: 'Political Science',
    year: 4,
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
    avatar: generateAvatar('Nusrat Jahan'),
    university: 'Jagannath University',
    department: 'Fine Arts',
    year: 2,
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
    avatar: generateAvatar('Abdullah Al Mamun'),
    university: 'Jagannath University',
    department: 'Physical Education',
    year: 3,
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