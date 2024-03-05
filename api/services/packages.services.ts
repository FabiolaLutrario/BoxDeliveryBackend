import Package from "../models/Package.models";

type PackageData = {
  id: string;
  receiver_name: string;
  date: Date;
  weight: number;
  address: string;
  status: "in-progress" | "delivered" | "pending";
  user_id: number;
  // [key: string | symbol]: any;
};

class PackagesServices {
  static addPackage(data: PackageData) {
    return new Promise((resolve, reject) => {
      Package.create(data)
        .then((packageData) => {
          resolve(packageData);
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  static getAllPackages(page: number = 1, pageSize: number = 15) {
    const offset = (page - 1) * pageSize;
    return Package.findAll({ offset, limit: pageSize });
  }

  static getAllPackagesByUserId(
    userId: number,
    page: number = 1,
    pageSize: number = 15
  ) {
    const offset = (page - 1) * pageSize;
    return Package.findAll({
      where: {
        user_id: userId,
      },
      offset,
      limit: pageSize,
    });
  }

  static getSinglePackage(packageId: string): Promise<Package | null> {
    return new Promise((resolve, reject) => {
      Package.findByPk(packageId)
        .then((singlePackage: Package | null) => resolve(singlePackage))
        .catch((error) => reject(error));
    });
  }

  static getPackagesByUserAndStatus(
    userId: number,
    status: string
  ): Promise<Package[]> {
    return new Promise((resolve, reject) => {
      Package.findAll({ where: { user_id: userId, status: status } })
        .then((packages: Package[]) => resolve(packages))
        .catch((error) => reject(error));
    });
  }

  static deletePackage(id: string) {
    return Package.findOne({ where: { id } }).then((packageResponse) => {
      if (packageResponse) {
        return packageResponse
          .destroy()
          .then(() => "Package deleted successfully")
          .catch(() => {
            throw new Error("Failure when trying to delete package");
          });
      }
      throw new Error("We could not find an package associated with that id");
    });
  }
}

export { PackagesServices };
