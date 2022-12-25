import Image from 'next/image';

const kinds = {
  0: 'sixty-percent',
  1: 'seventy-five-percent',
  2: 'eighty-percent',
  3: 'iso-105',
};

type KeyboardComponentProps = {
  kind: keyof typeof kinds,
  isPBT: boolean,
  filter: string,
};

const Keyboard = ({ kind, isPBT, filter }: KeyboardComponentProps) => {
  const kindDir = kinds[kind];

  const fileName = isPBT ? 'PBT' : 'ABS';

  const imagePath = `keyboards/${kindDir}/${fileName}.png`;
  const alt = `${kindDir} keyboard with ${isPBT ? 'PBT' : 'ABS'} keys ${filter ? `with ${filter}` : ''}`;

  return (
    <div className='rounded-lg p-2 border border-white'>
      <Image className={`h-[230px] w-[360px] ${filter}`} src={imagePath} alt={alt} />
    </div>
  );
};

export default Keyboard;
