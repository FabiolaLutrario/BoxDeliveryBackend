import Package from "../models/Package.models";

type PackageData = {
  receiver_name: string;
  date: Date;
  weight: string;
  address: string;
  status: "in-progress" | "delivered" | "pending";
  email_id: string;
  // [key: string | symbol]: any;
};

class PackagesServices {
  static addPackage(data: PackageData): Promise<PackageData> {
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

  static getAllPackages() {
    return Package.findAll();
  }

  static getSinglePackage(packageId: number): Promise<PackageData | null> {
    return new Promise((resolve, reject) => {
      Package.findByPk(packageId)
        .then((singlePackage: PackageData | null) => resolve(singlePackage))
        .catch((error) => reject(error));
    });
  }

  static getPackagesByUserAndStatus(
    userId: string,
    status: string
  ): Promise<PackageData[]> {
    return new Promise((resolve, reject) => {
      Package.findAll({ where: { email_id: userId, status: status } })
        .then((packages: PackageData[]) => resolve(packages))
        .catch((error) => reject(error));
    });
  }
}

export { PackagesServices };
