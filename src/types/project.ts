export interface ProjectAssets {
  folder: string;
  thumb: string;
  photo: string;
  image_count: number;
  image_ext: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  en_name: string;
  email: string;
  categories: string[];
  category_label: string;
  title: string;
  subtitle: string;
  description: string;
  link: string | null;
  linkname: string | null;
  youtube: string | null;
  assets: ProjectAssets;
}
