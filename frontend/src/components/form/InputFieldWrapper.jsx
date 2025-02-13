export default function InputFieldWrapper({ label, children, error }) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="relative">{children}</div>
      {!!error && (
        <p className="text-red-500 text-sm font-normal mt-2">{error.message}</p>
      )}
    </div>
  );
}
