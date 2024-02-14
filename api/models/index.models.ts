import User from "./User.models";
import Package from "./Package.models";

Package.belongsTo(User, { foreignKey: "email_id", as: "user" });

export default { User, Package };
