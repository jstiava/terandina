//works
function getSlug(str: string): string {
  const specialCharsRegex = /[^\w\s]/g;
  const whitespaceRegex = /\s+/g;
  const removeSpecialChars = str.replace(specialCharsRegex, '').toLowerCase();
  const finalString = removeSpecialChars.replace(whitespaceRegex, '-');

  return finalString;
}

export default getSlug;
