import e, { Request, Response } from "express";
import CustomerModel, {
  Customer,
  isValidNewdata,
  isValidUpdata,
} from "../model/customer";

const customerRouter = e.Router();

// 请求获取数据
customerRouter.get("/", (req: Request, res: Response) => {
  CustomerModel.find()
    .then((r) => res.send(r))
    .catch((e) => res.send(e));
});

// 添加数据
customerRouter.post("/", (req: Request, res: Response) => {
  const { error } = isValidNewdata(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new CustomerModel({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  customer
    .save()
    .then((newData) => res.send(newData))
    .catch((e) => res.send(e.message));
});

// 更新数据
customerRouter.put("/:id", (req: Request, res: Response) => {
  const { error } = isValidUpdata(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  CustomerModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  )
    .then((n) => res.send(n))
    .catch((e) => res.send(e.message));
});

// 删除数据
customerRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleteData = await CustomerModel.findByIdAndDelete(req.params.id, {
      new: true,
    });
    res.send(deleteData);
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
});

export default customerRouter;
