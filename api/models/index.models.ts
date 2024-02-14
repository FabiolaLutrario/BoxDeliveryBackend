import User from "./User.models";
import Package from "./Package.models";
import Values from "./Values.models";
import State from "./State.models";
import City from "./City.models";

Package.belongsTo(User, { foreignKey: "email_id" });
User.belongsTo(Values, { foreignKey: "confirmation_id" });
User.belongsTo(Values, { foreignKey: "user_Type_id" });
Package.belongsTo(State, { foreignKey: "state_id" });
Package.belongsTo(City, { foreignKey: "city_id" });

export default { User, Package, Values, State, City };
