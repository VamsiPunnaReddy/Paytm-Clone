"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/database/client"

export const createOnRampTranscition = async (amount: number, provider: string) => {
    const session = await getServerSession(authOptions)
    const token = Math.random().toString()
    if (!session.user) {
        return {
            message: "User not logged in"
        }
    }

    await prisma.onRampTransaction.create({
        data: {
            userId: Number(session.user?.id),
            provider,
            amount,
            token,
            startTime: new Date(),
            status: "Processing"
        }
    })

    return {
        message: "Done"
    }
}
