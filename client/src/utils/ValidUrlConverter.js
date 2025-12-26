export const validURLConvert = (value = "") => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD") // split accented chars
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/&/g, "and")
    .replace(/[\s_,]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};
