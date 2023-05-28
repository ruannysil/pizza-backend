import prismaClient from "../../prisma";

class ListOderService {
    async execute() {
        const order = await prismaClient.order.findMany({
            where: {
                draft: false,
                status: false,
            },
            orderBy: {
                craeted_at: 'desc'
            }
        })

        return order;
    }
}

export { ListOderService }