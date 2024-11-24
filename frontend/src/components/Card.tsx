import { Country } from '@/Types/CountryTypes';
interface options {
  timeZone: string;
  hour12: boolean;
  hour: string;
  minute: string;
  second: string;
}
const Card = ({ name, flag, region, timezones }: Country) => {
  function getCurrentTimesIn12HourFormat(offsets) {
    const currentTimeInOffsets = offsets.map((offset) => {
      const sign = offset.includes('-') ? -1 : 1;
      const hours = parseInt(offset.split('UTC')[1].split(':')[0], 10) * sign;

      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const offsetTime = new Date(utcTime + hours * 3600000);

      const hours12 = offsetTime.getHours() % 12 || 12; // Convert to 12-hour format
      const minutes = String(offsetTime.getMinutes()).padStart(2, '0');
      const ampm = offsetTime.getHours() >= 12 ? 'PM' : 'AM';

      return `${hours12}:${minutes} ${ampm}`;
    });

    return currentTimeInOffsets.join(', ');
  }
  return (
    <div className='p-4 bg-white shadow-md rounded-lg flex flex-col items-center justify-center'>
      <img src={flag} alt={`${name}'s flag`} className='w-16 h-16 object-cover rounded-md mb-2' />
      <h3 className='text-lg font-semibold mb-1'>{name}</h3>
      <p className='text-sm text-gray-500'>{region}</p>
      <p className='text-sm text-gray-700 mt-2'>{getCurrentTimesIn12HourFormat(timezones)}</p>
    </div>
  );
};

export default Card;
