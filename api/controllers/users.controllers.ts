import { Request, Response } from "express";
import { transporter } from "../config/mailer.config";
import User from "../models/User.models";
import { createToken, verifyToken } from "../config/tokens";
import { UsersServices } from "../services/users.services";
import { validateAuth } from "../middlewares/auth";
import { PackagesServices } from "../services/packages.services";

const port = process.env.LOCAL_HOST_FRONT;

class UsersControllers {
  static getAllUsers(req: Request, res: Response) {
    const page: number = parseInt(req.query.page as string) || 1;
    UsersServices.getAll(page)
      .then((users) => res.status(200).send(users))
      .catch((err: Error) => res.send(err));
  }

  static registerUser(req: Request, res: Response) {
    UsersServices.register(req.body)
      .then((user) => {
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

        // Proceso de envío de correo omitido para entorno de prueba
        if (process.env.NODE_ENV !== "test") {
          // Solo enviar el correo electrónico si no estamos en un entorno de prueba
          const confirmURL = `http://localhost:${port}/confirm-email/${user.token}`;
          const info = transporter.sendMail({
            from: '"Confirmación de correo electrónico" <appboxdelivery.mailing@gmail.com>',
            to: user.email,
            subject: "Confirmación de correo ✔",
            html: `<b>Por favor haz click en el siguiente link, o copia el enlace y pegalo en tu navegador para confirmar tu correo:</b><a href="${confirmURL}">${confirmURL}</a>`,
          });
          return info.then(() => {
            return res.status(201).send(payload);
          });
        } else {
          // En un entorno de prueba, simplemente responde con éxito
          return res.status(201).send(payload);
        }
      })
      .catch((err) => res.status(409).send(err.message));
  }

  static confirmEmail(req: Request, res: Response) {
    const { token } = req.params;
    if (!token) return res.sendStatus(401);

    return UsersServices.confirmEmail(token)
      .then(([affectedRows, [updatedUser]]) => {
        if (affectedRows === 0 || !updatedUser) return res.sendStatus(401);
        return res.status(200).send(`User ${updatedUser.email} confirmed`);
      })
      .catch(() => {
        res.status(500).send("Error confirming user!");
      });
  }

  static loginUser(req: Request, res: Response) {
    UsersServices.login(req.body)
      .then((response) =>
        res
          .status(200)
          .cookie("authToken", response.token, {
            sameSite: "none",
            httpOnly: true,
            secure: true,
          })
          .send(response.payload)
      )
      .catch((err) => res.status(401).send(err.message));
  }

  static logout(_req: Request, res: Response) {
    res.clearCookie("authToken");
    res.sendStatus(204);
  }

  static getDeliverymen(req: Request, res: Response) {
    const page: number = parseInt(req.query.page as string) || 1;
    UsersServices.getDeliverymen(page)
      .then((deliverymen) => res.status(200).send(deliverymen))
      .catch(() => {
        res.status(500).send("Error getting deliverymen!");
      });
  }

  static GetNumberOfDeliverymenAndEnadledDeliverymen(
    _req: Request,
    res: Response
  ) {
    interface Deliveryman {
      id: number;
      is_enabled: boolean;
    }
    UsersServices.GetNumberOfDeliverymenAndEnadledDeliverymen()
      .then((deliverymen: Deliveryman[]) => {
        const enabledDeliverymen = deliverymen.filter(
          (deliveryman) => deliveryman.is_enabled
        );
        res.status(200).send({
          enabledDeliverymenQuantity: enabledDeliverymen.length,
          deliverymenQuantity: deliverymen.length,
        });
      })
      .catch(() => {
        res.status(500).send("Error getting deliverymen!");
      });
  }

  static getUser(req: Request, res: Response) {
    UsersServices.getUser(parseInt(req.params.id))
      .then((user) => {
        if (!user) return res.sendStatus(204);
        if (!user.is_admin) {
          return PackagesServices.getAllPackagesByUserId(
            parseInt(req.params.id)
          ).then((packages) => {
            const payload = {
              id: user.id,
              email: user.email,
              name: user.name,
              last_name: user.last_name,
              profile_photo: user.profile_photo,
              is_admin: user.is_admin,
              is_confirmed: user.is_confirmed,
              is_enabled: user.is_enabled,
              packages: packages,
            };
            return res.status(200).send(payload);
          });
        } else {
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
          return res.status(200).send(payload);
        }
      })
      .catch(() => {
        res.status(500).send("Error getting user!");
      });
  }

  static getUserByEmail(req: Request, res: Response) {
    UsersServices.findOneUserByEmail(req.params.email)
      .then((user) => {
        if (!user) return res.sendStatus(204);
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
          last_name: user.last_name,
          profile_photo: user.profile_photo,
          is_admin: user.is_admin,
          token: user.token,
        };
        return res.status(200).send(payload);
      })
      .catch((err) => res.status(400).send(err));
  }

  static deleteDeliveryman(req: Request, res: Response) {
    UsersServices.deleteDeliveryman(req.body.email)
      .then(() => res.status(200).send("Deliveryman deleted successfully"))
      .catch(() =>
        res.status(500).send("Failure when trying to delete delivery man")
      );
  }

  static deleteAdmin(req: Request, res: Response) {
    const { email } = req.body;

    UsersServices.deleteAdmin(email)
      .then((response) => res.status(200).send(response))
      .catch((err) => res.status(500).send(err.message));
  }

  static sendEmail(req: Request, res: Response) {
    const email = req.body.email;

    UsersServices.findOneUserByEmail(email)
      .then((user: User | null) => {
        if (!user) {
          return res.status(404).send("Email does not exist");
        }
        if (!user.is_confirmed) {
          return res
            .status(401)
            .send("You must confirm email before restoring password");
        }
        //Si el usuario existe va a generar un token
        const payload = {
          email: user.email,
          name: user.name,
          last_name: user.last_name,
          profile_photo: user.profile_photo,
          is_admin: user.is_admin,
          is_confirmed: user.is_confirmed,
          is_enabled: user.is_enabled,
        };

        const token = createToken(payload, "10m");
        user.token = token;

        return user.save().then(() => {
          if (process.env.NODE_ENV !== "test") {
            // Genera el link de recuperación de contraseña y lo envía por correo
            const restorePasswordURL = `http://localhost:3001/new-password/${user.token}`;
            return transporter
              .sendMail({
                from: '"Recuperación de contraseña" <turnoweb.mailing@gmail.com>',
                to: user.email,
                subject: "Recuperación de contraseña ✔",
                html: `<b>Por favor haz click en el siguiente link, o copia el enlace y pegalo en tu navegador para completar el proceso:</b><a href="${restorePasswordURL}">${restorePasswordURL}</a>`,
              })
              .then(() => {
                return res.status(200).send(user.email);
              });
          } else {
            // En un entorno de prueba, simplemente responde con éxito sin enviar el correo
            return res.sendStatus(200);
          }
        });
      })
      .catch((error) => {
        console.error("Error when trying to restore password:", error);
        res.status(500).send("Internal Server Error");
      });
  }

  /*  Una vez que el usuario recibe el correo con el link para cambiar la contraseña
  se procede a validar el token para mostrar en el front el formulario para 
  ingresar la nueva contraseña*/
  static validateTokenToRestorePassword(req: Request, res: Response) {
    const { token } = req.params;
    if (!token) return res.sendStatus(401);

    const user = verifyToken(token);
    if (!user) return res.sendStatus(401);

    return UsersServices.findOneUserByToken(token)
      .then((user) => {
        if (!user) return res.sendStatus(401);
        return res.sendStatus(200);
      })
      .catch((error) => {
        console.error("Error when trying to validate token:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  /* En el momento en que el usuario le de click para confirmar la nueva contraseña y haya
  pasado las validaciones del front vuelve a verificar si el token sigue siendo válido o 
  si no ha expirado y luego se guarda la nueva contraseña*/
  static overwritePassword(req: Request, res: Response) {
    const { token } = req.params;
    const { password } = req.body;
    if (!token)
      return res.status(401).send({ message: "Token does not exist" });

    const user = verifyToken(token);
    // eslint-disable-next-line no-console
    console.log("respuesta de verify token", user);

    if (!user) return res.sendStatus(401);
    if (!password) return res.sendStatus(400).send("Password is required!");
    return UsersServices.findOneUserByToken(token)
      .then((user: User | null) => {
        if (!user) return res.sendStatus(401);

        user.token = null;
        user.password = password;
        return user.save().then(() => {
          return res.sendStatus(200);
        });
      })
      .catch((error) => {
        console.error("Error when trying to overwrite password:", error);
        return res.status(500).send(error);
      });
  }

  static me(req: Request, res: Response) {
    validateAuth(req, res, () => {
      const user = req.payload;
      res.status(200).send(user);
    });
  }

  static deliveryStatus(req: Request, res: Response) {
    const email = req.body.email;
    UsersServices.updateDeliveryStatus(email)
      .then((resp) => {
        if (resp[0] === 1) res.status(200).send("user updated successfully");
        else {
          res.status(422).send("error updating user");
        }
      })
      .catch((error) => {
        console.error("Error when trying to overwrite password:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}
export { UsersControllers };
