interface BlogPostData {
  id: string | number;
  title: string;
  excerpt: string;
  thumbnail: string;
  date_published: string;
  tags: string[];
  user: {
    id: string | number;
    name: string;
    image: string;
  };
  reactions: Array<unknown>;
  is_featured?: boolean;
}

export const convertToBlogPost = (data: BlogPostData) => {
  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    thumbnail: data.thumbnail,
    date_published: data.date_published,
    tags: data.tags,
    author: {
      id: data.user.id,
      name: data.user.name,
      avatar: data.user.image,
    },
    reactions: data.reactions.length,
    featured: data.is_featured || false,
  };
};
