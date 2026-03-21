export interface News {
  id: string;
  title: string;
  date: string;
  category: 'Update' | 'Release' | 'Event' | 'Media' | string;
  summary: string;
  content: string;
}
