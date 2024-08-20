export const getUsernameStr = (username: string): string => {
  if (username.includes(" ")) {
    return username;
  } else {
    return `@${username}`;
  }
};
