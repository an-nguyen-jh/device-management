import ENV_CONFIG from "..";

export const teamOptions = [
  { key: "Sweet Cake", value: "Sweet Cake" },
  { key: "Yin Yang", value: "Yin Yang" },
  { key: "Designer", value: "Designer" },
  { key: "Admin", value: "Admin" },
];
export const deviceOptions = [
  { key: "computer", value: "Máy tính" },
  { key: "screen", value: "Màn hình" },
  { key: "mouse", value: "Chuột" },
];

export const sortOptions = [
  {
    key: ENV_CONFIG.SORT.ASCEND_NAME,
    value: "Name ascending",
  },
  {
    key: ENV_CONFIG.SORT.DESCEND_NAME,
    value: "Name descending",
  },
  {
    key: ENV_CONFIG.SORT.ASCEND_UPDATE_DATE,
    value: "UpdatedDate ascending",
  },
  {
    key: ENV_CONFIG.SORT.DESCEND_UPDATE_DATE,
    value: "UpdatedDate descending",
  },
];