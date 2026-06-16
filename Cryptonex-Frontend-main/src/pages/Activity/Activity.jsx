import TreadingHistory from '../Portfilio/TreadingHistory';

const Activity = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16">
      <p className="py-5 pb-8 text-xl sm:text-2xl font-semibold">Trading History</p>
      <TreadingHistory />
    </div>
  );
};

export default Activity;
