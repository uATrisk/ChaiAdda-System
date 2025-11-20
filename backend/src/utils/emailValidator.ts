export function isCollegeEmail(email:string): boolean {
  const regex = /@([a-zA-Z0-9-]+\.)*rishihood\.edu\.in$/i;
  return regex.test(email);
}