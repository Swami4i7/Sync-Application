import NextAuth, { SessionStrategy, User, Session, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { userLogin } from "@/app/actions/login/login";

declare module "next-auth" {
  interface User {
    id: string | number; 
    username: string; 
    role: string;
  }

  interface Session {
    user: {
      id: string | number; 
      username: string; 
      role: string; 
      name?: string; 
      email?: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string | number; 
    username: string;
    role: string; 
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        encryptedBody: { label: "Encrypted Body", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.encryptedBody) {
          return null;
        }
        try {
          const response = await userLogin(credentials.encryptedBody);
  
          if (response.status === 200) {
            const user = response.data[0];
            return {
              id: user.USER_ID,
              username: user.USER_NAME,
              role: user.ROLE,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 60 * 60, 
    updateAge: 60 * 60, 
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user) { 
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    },
  },
  events: {
    async signIn(message) {
      if(message)
      console.log("User signed in:", message);
    },
    async signOut(message) {
      console.log("User signed out:", message);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };