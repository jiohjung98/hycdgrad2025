import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "2020031330",
    slug: "심주형",
    name: "심주형",
    en_name: "Shim Joo Hyung",
    email: "ppickle0608@naver.com",
    categories: [],
    category_label: "캐릭터 및 일러스트",
    title: "Snubbies",
    subtitle: "특수반려동물 인지도 개선 캐릭터 브랜딩",
    description: "작품설명 텍스트",
    link: "https://www.naver.com",
    linkname: "(임시)네이버",
    youtube: null,
    assets: {
      folder: "2020031330",
      thumb: "thumb.jpg",
      photo: "photo.jpg",
      image_count: 8,
      image_ext: "jpg",
    },
  },
  {
    id: "2020031331",
    slug: "브랜드",
    name: "브랜드",
    en_name: "Brand Design",
    email: "branddesign@gmail.com",
    categories: [],
    category_label: "브랜드",
    title: "브랜드 테스트",
    subtitle: "브랜드 카테고리 확인용 테스트",
    description: "브랜드 설명",
    link: "https://www.google.com",
    linkname: "(임시) 구글",
    youtube: "https://youtu.be/lQGRBJTH2cs",
    assets: {
      folder: "2020031331",
      thumb: "thumb.jpg",
      photo: "photo.jpg",
      image_count: 10,
      image_ext: "jpg",
    },
  },
];

export default projects;
