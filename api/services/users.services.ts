import User from "../models/User.models";
import { createToken } from "../config/tokens";
import Package from "../models/Package.models";

type userDataType = {
  [key: string]: string | boolean | null | number;
  id: number;
  email: string;
  name: string;
  last_name: string;
  password: string;
  profile_photo: string | null;
  is_admin: boolean;
  is_confirmed: boolean;
  is_enabled: boolean;
};

type deliverymanWithPackages = {
  id: number;
  email: string;
  name: string;
  last_name: string;
  profile_photo: string | null;
  is_admin: boolean;
  is_confirmed: boolean;
  is_enabled: boolean;
  packagesQuantity: number;
  packagesDeliveredQuantity: number;
};

class UsersServices {
  static async getAll(page: number = 1, pageSize: number = 15) {
    const offset = (page - 1) * pageSize;
    return await User.findAll({
      offset,
      limit: pageSize,
      attributes: { exclude: ["password", "salt", "token"] },
    });
  }

  static register(userData: userDataType) {
    if (
      !userData.email ||
      !userData.name ||
      !userData.last_name ||
      !userData.password
    )
      throw new Error("Please complete all fields");

    const { email, name, last_name, password, is_confirmed } = userData;
    let { is_admin } = userData;

    if (!is_admin) is_admin = false;

    return User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          throw new Error("Account already associated with this email");
        }

        const payload = {
          email: email,
          name: name,
          last_name: last_name,
          is_admin: is_admin,
        };

        const token = createToken(payload, "10d");

        return User.create({
          email,
          name,
          last_name,
          token,
          password,
          is_admin,
          is_confirmed,
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  static login(userData: userDataType) {
    if (!userData.email || !userData.password)
      throw new Error("Please complete all the fields");

    const { email, password } = userData;

    return User.findOne({ where: { email } })
      .then((user) => {
        if (!user) throw new Error("Incorrect email or password");
        return user
          .validatePassword(password)
          .then((isOk) => {
            if (!isOk) throw new Error("Incorrect email or password");
            if (!user.is_confirmed)
              throw new Error(
                "Please confirm your account before trying to log in"
              );
            const payload = {
              id: user.id,
              email: user.email,
              name: user.name,
              last_name: user.last_name,
              profile_photo: user.profile_photo,
              is_admin: user.is_admin,
              is_confirmed: user.is_confirmed,
              is_enabled: user.is_enabled,
            };
            const token = createToken(payload);

            return {
              token,
              payload,
            };
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  static confirmEmail(token: string) {
    return User.update(
      {
        is_confirmed: true,
        token: null,
      },
      { where: { token }, returning: true }
    );
  }

  static async getDeliverymen(page: number = 1, pageSize: number = 15) {
    const offset = (page - 1) * pageSize;
    return await User.findAll({
      where: { is_admin: false },
      attributes: { exclude: ["password", "salt", "token"] },
      offset,
      limit: pageSize,
    })
      .then((deliverymen) => {
        return deliverymen;
      })
      .catch((error) => {
        return error;
      });
  }

  static async getDeliverymenWithPackagesQuantityByDate(
    page: number = 1,
    pageSize: number = 15,
    date: string
  ) {
    const offset = (page - 1) * pageSize;
    const deliverymenResult: deliverymanWithPackages[] = [];

    const deliverymen = await User.findAll({
      where: { is_admin: false, is_confirmed: true },
      attributes: { exclude: ["password", "salt", "token"] },
      offset,
      limit: pageSize,
    });

    await Promise.all(
      deliverymen.map(async (deliveryman) => {
        if (deliveryman.id !== undefined) {
          const userId: number = deliveryman.id;
          const packagesQuantity = await Package.count({
            where: {
              user_id: userId,
              date: date,
            },
          });

          const packagesDeliveredQuantity = await Package.count({
            where: {
              user_id: userId,
              date: date,
              status: "delivered",
            },
          });

          const payload = {
            id: userId,
            email: deliveryman.email,
            name: deliveryman.name,
            last_name: deliveryman.last_name,
            profile_photo: deliveryman.profile_photo || null,
            is_admin: deliveryman.is_admin || false,
            is_confirmed: deliveryman.is_confirmed || false,
            is_enabled: deliveryman.is_enabled || false,
            packagesQuantity: packagesQuantity,
            packagesDeliveredQuantity: packagesDeliveredQuantity,
          };

          deliverymenResult.push(payload);
        }
      })
    );
    return deliverymenResult;
  }

  static async GetNumberOfDeliverymenAndEnadledDeliverymen() {
    return await User.findAll({
      where: { is_admin: false, is_confirmed: true },
      attributes: {
        exclude: [
          "email",
          "name",
          "last_name",
          "password",
          "salt",
          "token",
          "profile_photo",
          "is_admin",
          "is_confirmed",
        ],
      },
    })
      .then((deliverymen) => {
        return deliverymen;
      })
      .catch((error) => {
        return error;
      });
  }

  static getUser(id: number) {
    return User.findOne({ where: { id: id } });
  }

  static deleteDeliveryman(email: string) {
    return User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          return user.destroy();
        }
        throw new Error(
          "We could not find the deliveryman asociated with that email"
        );
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  static deleteAdmin(email: string) {
    return User.destroy({ where: { email: email, is_admin: true } })
      .then((resp) => {
        resp;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static findOneUserByEmail(email: string) {
    return User.findOne({ where: { email } }).catch((error) => {
      throw new Error(error);
    });
  }

  static findOneUserByToken(token: string) {
    return User.findOne({ where: { token } });
  }

  static enableDeliveryman(userId: number) {
    return (
      User.update(
        { is_enabled: true },
        { returning: true, where: { id: userId } }
      )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then(([_affectedRows, response]) => {
          return response;
        })
        .catch((error) => {
          throw new Error(error);
        })
    );
  }

  static disableDeliveryman(userId: number) {
    return (
      User.update(
        { is_enabled: false },
        { returning: true, where: { id: userId } }
      )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then(([_affectedRows, response]) => {

          return response;
        })
        .catch((error) => {
          throw new Error(error);
        })
    );
  }
}

export { UsersServices };
