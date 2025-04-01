import React, { FC } from "react";

const LabeledInput = ({ label, type, placeholder, id, error, ...rest }) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          {label}
        </label>
      )}

      <input
        type={type}
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
        placeholder={placeholder}
        {...rest}
      />
      {error && <span className="text-red-500 mt-3">{error}</span>}
    </div>
  );
};

export default LabeledInput;
