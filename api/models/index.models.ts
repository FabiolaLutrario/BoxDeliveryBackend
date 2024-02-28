import User from "./User.models";
import Package from "./Package.models";

Package.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default { User, Package };
