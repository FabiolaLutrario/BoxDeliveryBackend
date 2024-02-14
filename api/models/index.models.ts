import User from "./User.models";
import Package from "./Package.models";
import Values from "./Value.models";
import State from "./State.models";
import City from "./City.models";

Package.belongsTo(User, { foreignKey: "email_id", as: "user" });
User.belongsTo(Values, { foreignKey: "confirmation_id", as: "values" });
User.belongsTo(Values, { foreignKey: "user_Type_id", as: "value" });
Package.belongsTo(State, { foreignKey: "state_id", as: "state" });
Package.belongsTo(City, { foreignKey: "city_id", as: "city" });

export default { User, Package, Values, State, City };
