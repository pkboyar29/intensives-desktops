export interface ITest {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  author: number; // или объект, если нужно
}
export interface ITestCreate {
  name: string;
  description?: string;
  author: number;
  categories?: { name: string }[];
  questions?: { question: number; order: number; category?: string | null }[];
}
