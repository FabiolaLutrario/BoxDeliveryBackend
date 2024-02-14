import User from "./User.models";
import Package from "./Package.models";
import Value from "./Value.models";
import State from "./State.models";
import City from "./City.models";

Package.belongsTo(User, { foreignKey: "email_id", as: "user" });
User.belongsTo(Value, { foreignKey: "confirmation_id", as: "value" });
User.belongsTo(Value, { foreignKey: "user_type_id", as: "value" });
Package.belongsTo(State, { foreignKey: "state_id", as: "state" });
Package.belongsTo(City, { foreignKey: "city_id", as: "city" });

export default { User, Package, Value, State, City };
