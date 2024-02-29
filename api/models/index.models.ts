import User from "./User.models";
import Package from "./Package.models";

Package.belongsTo(User, { foreignKey: "user_id", as: "user" });
//User.hasMany(Package, { foreignKey: "user_id", as: "package" });

export default { User, Package };
