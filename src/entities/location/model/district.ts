import koreaDistricts from '@/shared/assets/data/korea_districts.json';

export interface DistrictTree {
  [province: string]: {
    [city: string]: string[];
  };
}

// 💡 메모리 효율을 위해 파일 로드 시점에 딱 한 번만 변환합니다.
const DISTRICT_TREE: DistrictTree = (() => {
  const tree: DistrictTree = {};
  koreaDistricts.forEach((address: string) => {
    const [province, city, dong] = address.split('-');
    if (!province) return;
    if (!tree[province]) tree[province] = {};
    if (!city) return;
    if (!tree[province][city]) tree[province][city] = [];
    if (dong) tree[province][city].push(dong);
  });
  return tree;
})();

/**
 * UI에서 필요한 단계별 데이터를 추출하는 훅
 */
export const useDistrictData = (selectedProvince?: string, selectedCity?: string) => {
  const provinces = Object.keys(DISTRICT_TREE);

  const cities = selectedProvince ? Object.keys(DISTRICT_TREE[selectedProvince] || {}) : [];

  const dongs = selectedProvince && selectedCity ? DISTRICT_TREE[selectedProvince][selectedCity] || [] : [];

  return {
    provinces,
    cities,
    dongs,
  };
};
