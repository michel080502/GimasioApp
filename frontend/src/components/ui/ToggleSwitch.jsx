import { useState } from "react";
import PropTypes from "prop-types";

const ToggleSwitch = ({ avaliable, onToggle }) => {
  const [isChecked, setIsChecked] = useState(avaliable);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (onToggle) onToggle(!isChecked);
  };
  return (
    <form>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          onChange={handleToggle}
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:bg-green-500 transition-all">
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
              isChecked ? "translate-x-5" : ""
            }`}
          ></div>
        </div>
      </label>
    </form>
  );
};
ToggleSwitch.propTypes = {
  avaliable: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default ToggleSwitch;
