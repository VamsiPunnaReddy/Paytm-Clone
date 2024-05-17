import express from "express"
import prisma from "@repo/database/client"

const app = express()

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    const { token, user_identifier, amount } = req.body

    const paymentInformation: {
        token: string,
        userId: string,
        amount: string
    } = {
        token,
        userId: user_identifier,
        amount
    };

    try {
        const { status }: any = await prisma.onRampTransaction.findFirst({
            where: {
                token: paymentInformation.token,
            },
            select: {
                status: true
            }
        })
        if (status == "Success") {
            return res.json({ message: "already done" })
        }

        await prisma.$transaction([

            prisma.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),

            prisma.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success"
                }
            })
        ])
    } catch (e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

    res.json({ message: "captured" })
    // Update balance in db, add txn
})

app.listen(3003);