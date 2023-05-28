import { Request, Response } from "express";
import { ListOderService } from "../../services/order/ListOderService";

class ListOrderController {
    async handle(req: Request, res: Response) {
        const listOrderService = new ListOderService();

        const orders = await listOrderService.execute();

        return res.json(orders)
    }
}

export { ListOrderController }