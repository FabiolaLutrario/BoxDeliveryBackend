import { Request, Response } from "express";
import { PackagesServices } from "../services/packages.services";

const PackagesControllers = {
  addPackage: (req: Request, res: Response) => {
    PackagesServices.addPackage(req.body)
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((error: Error) => {
        res.status(500).send({ error: error.message });
      });
  },
  getAllPackages: (req: Request, res: Response) => {
    const page: number = parseInt(req.query.page as string) || 1;
    PackagesServices.getAllPackages(page)
      .then((packages) => {
        res.status(200).send(packages);
      })
      .catch((error: Error) => {
        res.status(500).send({ error: error.message });
      });
  },
  getSinglePackage: (req: Request, res: Response) => {
    PackagesServices.getSinglePackage(req.params.id)
      .then((singlePackage) => {
        if (singlePackage) {
          res.status(200).send(singlePackage);
        } else {
          res.status(404).send("Package not found");
        }
      })
      .catch((error) => res.status(500).send({ error: error.message }));
  },
  getPackagesByUserAndStatus: (req: Request, res: Response) => {
    const { status } = req.params;
    PackagesServices.getPackagesByUserAndStatus(
      parseInt(req.params.user_id),
      status
    )
      .then((packages) => res.status(200).send(packages))
      .catch((error) => res.status(500).send({ error: error.message }));
  },

  deletePackage: (req: Request, res: Response) => {
    const { id } = req.params;

    PackagesServices.deletePackage(id)
      .then((response) => res.status(200).send(response))
      .catch((err) => res.status(500).send(err.message));
  },
};

export { PackagesControllers };
