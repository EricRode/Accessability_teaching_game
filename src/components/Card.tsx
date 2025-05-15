export const Card = ({ text }: { text: string }) => {
    return (
      <div className="p-6 bg-white text-lg text-center border rounded-xl w-80 shadow">
        {text}
      </div>
    );
  };
  