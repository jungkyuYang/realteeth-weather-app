import { useQuery } from '@tanstack/react-query';

export interface DistrictTree {
  [province: string]: {
    [city: string]: string[];
  };
}

// 💡 변환 로직은 순수 함수로 분리 (메모리 밖으로 추출)
const transformToTree = (rawData: string[]): DistrictTree => {
  const tree: DistrictTree = {};
  rawData.forEach((address: string) => {
    const [province, city, dong] = address.split('-');
    if (!province) return;
    if (!tree[province]) tree[province] = {};
    if (!city) return;
    if (!tree[province][city]) tree[province][city] = [];
    if (dong) tree[province][city].push(dong);
  });

  return tree;
};

export const useDistrictData = (selectedProvince?: string, selectedCity?: string) => {
  // TanStack Query로 public에 있는 데이터를 fetch
  const { data: districtTree, isLoading } = useQuery({
    queryKey: ['koreaDistricts'],
    queryFn: async () => {
      const response = await fetch('/data/korea_districts.json');
      if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');
      const rawData = await response.json();

      return transformToTree(rawData);
    },
    staleTime: Infinity, // 데이터가 변하지 않으므로 무한 캐싱
    gcTime: Infinity,
  });

  // 데이터가 로드되지 않았을 때를 위한 기본값 설정
  const tree = districtTree || {};

  const provinces = Object.keys(tree);

  const cities = selectedProvince ? Object.keys(tree[selectedProvince] || {}) : [];

  const dongs = selectedProvince && selectedCity ? tree[selectedProvince][selectedCity] || [] : [];

  return {
    provinces,
    cities,
    dongs,
    isLoading, // 로딩 상태를 UI에 전달 가능
  };
};
