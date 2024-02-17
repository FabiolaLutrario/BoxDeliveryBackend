import { Request, Response } from "express";
import { transporter } from "../config/mailer.config";
import User from "../models/User.models";
import { createToken, verifyToken } from "../config/tokens";
import { JwtPayload } from "jsonwebtoken";

class UsersController {
  static sendEmail(req: Request, res: Response) {
    const email = req.body.email;

    User.findOne({ where: { email } })
      .then((user: User | null) => {
        if (!user) {
          res.sendStatus(401);
          return; // Termina la ejecución de la función después de enviar el estado
        }

        //Si el usuario existe va a generar un token
        const payload = {
          email: user.email,
          name: user.name,
          last_name: user.last_name,
          profile_photo: user.profile_photo,
          is_admin: user.is_admin,
        };

        const token = createToken(payload, "10m");
        user.token = token;

        user
          .save()
          .then(() => {
            //Genera el link de recuperación de contraseña y lo envía por correo
            const restorePasswordURL = `http://localhost:3000/new-password/${user.token}`;
            transporter
              .sendMail({
                from: '"Recuperación de contraseña" <turnoweb.mailing@gmail.com>',
                to: user.email,
                subject: "Recuperación de contraseña ✔",
                html: `<b>Por favor haz click en el siguiente link, o copia el enlace y pegalo en tu navegador para completar el proceso:</b><a href="${restorePasswordURL}">${restorePasswordURL}</a>`,
              })
              .then(() => {
                res.status(200).send(user.email);
              })
              .catch((error: Error) => {
                console.error("Error when trying to send email:", error);
                res.status(500).send("Internal Server Error");
              });
          })
          .catch((error) => {
            console.error("Error when trying to save user:", error);
            res.status(500).send("Internal Server Error");
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
    const token = req.params.token;
    if (!token) return res.sendStatus(401);

    const decoded = verifyToken(token);
    if (typeof decoded === "string") {
      // Si decoded es una cadena (string), significa que hubo un error en la verificación del token
      return res.status(401).send("Invalid token.");
    }
    const { user } = decoded as JwtPayload;
    if (!user) return res.sendStatus(401);

    return User.findOne({ where: { token } })
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
    const token = req.params.token;
    if (!token) return res.sendStatus(401);

    const decoded = verifyToken(token);
    if (typeof decoded === "string") {
      // Si decoded es una cadena (string), significa que hubo un error en la verificación del token
      return res.status(401).send("Invalid token.");
    }
    const { user } = decoded as JwtPayload;
    if (!user) return res.sendStatus(401);

    return User.findOne({ where: { token } })
      .then((user: User | null) => {
        if (!user) return res.sendStatus(401);

        user.token = null;
        user.password = req.body.password;
        return user.save().then(() => {
          return res.sendStatus(200);
        });
      })
      .catch((error) => {
        console.error("Error when trying to overwrite password:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}
export { UsersController };
