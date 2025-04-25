// types/course.ts
export interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    professorId: {
      _id: string;
      name: string;
      email: string;
    };
    thumbnailUrl: string;
    createdAt: string;
    updatedAt: string;
  }