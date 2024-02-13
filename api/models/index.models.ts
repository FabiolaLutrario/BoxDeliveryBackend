import User from "./User.models";
import Package from "./Package.models";

Package.belongsTo(User, { as: "deliveryman", foreignKey: "deliveredBy" });

export default { User, Package };
