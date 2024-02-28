import User from "../models/User.models";
import { createToken } from "../config/tokens";

type userDataType = {
  [key: string]: string | boolean | null | number;
  id: number;
  email: string;
  name: string;
  last_name: string;
  password: string;
  is_admin: boolean | null;
  is_confirmed: boolean;
};

class UsersServices {
  static getAll(page: number = 1, pageSize: number = 15) {
    const offset = (page - 1) * pageSize;
    return User.findAll({ offset, limit: pageSize });
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
    const { email, password } = userData;

    if (!email || !password) throw new Error("Please complete all the fields");

    return User.findOne({ where: { email } })
      .then((user) => {
        if (!user) throw new Error("No account associated with that email");
        return user
          .validatePassword(password)
          .then((isOk) => {
            if (!isOk) throw new Error("Incorrect password, try again");
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

  static confirmEmail(token: string) {
    return User.update(
      {
        is_confirmed: true,
        token: null,
      },
      { where: { token }, returning: true }
    );
  }

  static getDeliverymen() {
    return User.findAll({ where: { isAdmin: false } })
      .then((resp) => {
        resp;
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
   resp
  })
  .catch((error) => {
    throw new Error(error);
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
