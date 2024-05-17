import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const alice = await prisma.user.upsert({
        where: { number: '9999999999' },
        update: {},
        create: {
            number: '9999999999',
            password: 'alice',
            name: 'alice',
            Balance: {
                create: {
                    amount: 0,
                    locked: 0
                }
            }
        },
    })
    const bob = await prisma.user.upsert({
        where: { number: '9999999998' },
        update: {},
        create: {
            number: '9999999998',
            password: 'bob',
            name: 'bob',
            Balance: {
                create: {
                    amount: 0,
                    locked: 0
                }
            }
        },
    })
    console.log({ alice, bob })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })