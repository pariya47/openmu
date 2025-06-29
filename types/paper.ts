export interface Subtopic {
  subtopic_title: string;
  content?: string;
  mermaid?: string;
}

export interface Topic {
  topic: string;
  subtopics: Subtopic[];
}

export interface Paper {
  id: string;
  topics: Topic[];
  created_at?: string;
}
