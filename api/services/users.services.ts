import User from "../models/User.models";
import { createToken } from "../config/tokens";

type userDataType = {
  [key: string]: string;
  email: string;
  name: string;
  last_name: string;
  password: string;
};

class UsersServices {
  static getAll() {
    return User.findAll();
  }

  static register(userData: userDataType) {
    const { email, name, last_name, password } = userData;

    if (!email || !name || !last_name || !password) {
      throw new Error("Please complete all fields");
    }

    return User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          throw new Error("Account already associated with this email");
        }

        return User.create(userData);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  static login(userData: userDataType) {
    const { email, password } = userData;

    if (!email || !password) throw new Error("Please complete all the fields");

    return User.findOne({ where: { email } })
      .then((user) => {
        if (!user) throw new Error("No account associated with that email");
        return user
          .validatePassword(password)
          .then((isOk) => {
            if (!isOk) throw new Error("Validation error, try again");
            if (!user.is_confirmed)
              throw new Error(
                "Please confirm your account before trying to log in"
              );
            const payload = {
              email,
              name: user.name,
              last_name: user.last_name,
              isAdmin: user.is_admin,
              isConfirmed: user.is_confirmed,
            };
            const token = createToken(payload);

            return {
              token,
              message: "You are now logged in!",
            };
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  static getDeliverymen() {
    return User.findAll({ where: { isAdmin: false } });
  }

  static getOneDeliveryman(id: string) {
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
    return User.findOne({ where: { email, isAdmin: true } }).then((user) => {
      if (user) {
        return user
          .destroy()
          .then(() => "Account deleted successfully")
          .catch(() => {
            throw new Error("Failure when trying to delete account");
          });
      }

      throw new Error(
        "We could not find an account associated with that email"
      );
    });
  }

  static findOneUserByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  static findOneUserByToken(token: string) {
    return User.findOne({ where: { token } });
  }
}

export { UsersServices };
