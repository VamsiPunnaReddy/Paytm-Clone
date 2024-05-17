import prisma from "@repo/database/client";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        })
    ],
    callbacks: {
        async signIn({ user, account }: any) {
            console.log("hi signin")
            if (!user || !user.email) {
                return false;
            }

            await prisma.merchant.upsert({
                select: {
                    id: true
                },
                where: {
                    email: user.email
                },
                create: {
                    email: user.email,
                    name: user.name,
                    auth_type: account.provider === "google" ? "Google" : "Github" // Use a prisma type here
                },
                update: {
                    name: user.name,
                    auth_type: account.provider === "google" ? "Google" : "Github" // Use a prisma type here
                }
            });

            return true;
        }
    },
    secret: process.env.JWT_SECRET || "secret"
}
