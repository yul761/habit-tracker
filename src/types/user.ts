export type User = {
  given_name: string
  family_name: string
  email: string
  name: string
  picture: string
}

export class UserProfile {
  given_name: string
  family_name: string
  email: string
  name: string
  picture: string

  constructor(
    given_name: string,
    family_name: string,
    email: string,
    name: string,
    picture: string
  ) {
    this.given_name = given_name
    this.family_name = family_name
    this.email = email
    this.name = name
    this.picture = picture
  }
}
