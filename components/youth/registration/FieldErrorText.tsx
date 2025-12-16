type FieldErrorTextProps = {
  message?: string;
};

function FieldErrorText({ message }: FieldErrorTextProps) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-rose-500">{message}</p>;
}

export default FieldErrorText;
