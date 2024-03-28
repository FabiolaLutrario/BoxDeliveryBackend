import { Request, Response } from "express";
import { PackagesServices } from "../services/packages.services";

const PackagesControllers = {
  addPackage: (req: Request, res: Response) => {
    const { receiver_name, date, weight, address } = req.body;
    if (!receiver_name || !date || !weight || !address)
      return res.status(400).send("Please complete all fields");
    return PackagesServices.addPackage(req.body)
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((error: Error) => {
        res.status(500).send({ error: error.message });
      });
  },

  getUnassignedPackages: (req: Request, res: Response) => {
    const page: number = parseInt(req.query.page as string) || 1;
    PackagesServices.getPackages(page)
      .then((packages) => {
        res.status(200).send(packages);
      })
      .catch((error: Error) => {
        res.status(500).send({ error: error.message });
      });
  },
  getNumberOfPacakgesAndPackagesDeliveredByDate: (
    _req: Request,
    res: Response
  ) => {
    interface Package {
      id: string;
      status: string;
    }
    const { date } = _req.params;
    PackagesServices.getNumberOfPacakgesAndPackagesDeliveredByDate(date)
      .then((packages: Package[]) => {
        const deliveredPackages = packages.filter(
          (packageResult) => packageResult.status === "delivered"
        );
        res.status(200).send({
          deliveredPackagesQuantity: deliveredPackages.length,
          packagesQuantity: packages.length,
        });
      })
      .catch(() => {
        res.status(500).send("Error getting packages!");
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
      .then((packages) => {
        if (packages) {
          res.status(200).send(packages);
        } else {
          res.status(404).send("Packages not found");
        }
      })
      .catch((error) => res.status(500).send({ error: error.message }));
  },
  getPackagesByStatusAndDate: (req: Request, res: Response) => {
    const { status, date } = req.params;
    PackagesServices.getPackagesByStatusAndDate(status, date)
      .then((packages) => {
        if (packages) {
          res.status(200).send(packages);
        } else {
          res.status(404).send("Packages not found");
        }
      })
      .catch((error) => res.status(500).send({ error: error.message }));
  },
  assignPackage: (req: Request, res: Response) => {
    const { packageId, userId } = req.params;
    PackagesServices.assign(packageId, userId)
      .then(() =>
        res.status(200).send("The package is now assigned to the deliveryman")
      )
      .catch((error: Error) => {
        return res
          .status(
            error.message === "We could not find the package requested"
              ? 404
              : 400
          )
          .send(`${error.message}`);
      });
  },

  startTrip: (req: Request, res: Response) => {
    const { packageId } = req.params;
    PackagesServices.updateStatus(packageId)
      .then(() => res.status(200).send("The trip has started!"))
      .catch((err) =>
        res.status(400).send(`Error starting trip: ${err.message}`)
      );
  },

  finishTrip: (req: Request, res: Response) => {
    const { packageId } = req.params;
    PackagesServices.finishDelivery(packageId)
      .then(() => res.status(200).send("The package has been delivered"))
      .catch((err) =>
        res.status(400).send(`Error finishing trip: ${err.message}`)
      );
  },

  cancelTrip: (req: Request, res: Response) => {
    const { packageId } = req.params;
    PackagesServices.cancelDelivery(packageId)
      .then(() => res.status(200).send("The delivery has been canceled"))
      .catch((err) =>
        res.status(400).send(`Error canceling trip: ${err.message}`)
      );
  },

  removeAssignedUser: (req: Request, res: Response) => {
    const { packageId } = req.params;
    PackagesServices.removeUserFromPackage(packageId)
      .then(() =>
        res.status(200).send("The deliverman has been removed from the package")
      )
      .catch((err) => res.status(400).send(err.message));
  },

  removeAllAssigned: (_req: Request, res: Response) => {
    PackagesServices.removeAllUsersFromPackages()
      .then(() => res.status(200).send("All delivermen removed from packages"))
      .catch((err) => res.status(400).send(err.message));
  },

  deletePackage: (req: Request, res: Response) => {
    const { id } = req.params;

    PackagesServices.deletePackage(id)
      .then((response) => res.status(200).send(response))
      .catch((err) => res.status(500).send(err.message));
  },

  deletePackages: (_req: Request, res: Response) => {
    PackagesServices.deletePackages()
      .then((response) => res.status(200).send(response))
      .catch((err) => res.status(500).send(err.message));
  },
};

export { PackagesControllers };
