import NextAuth, { Account, User, Profile } from 'next-auth';
import GithubProvider from "next-auth/providers/github";
import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';

interface SignInProps {
  user: User;
  account: Account;
  profile: Profile;
  email: {
    verificationRequest?: boolean;
  };
}

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user, account, profile }: SignInProps) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )

        )

        return true;
      } catch {
        return false;
      }
    },
  }
})