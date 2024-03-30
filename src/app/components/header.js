export default function Header() {
  return (
    <div className="flex py-4 px-3 border-b border-slate-200">
      <div className='flex flex-col justify-center mr-3'>
        <img src='icon.svg' className='w-10 h-10 lg:w-20 lg:h-20' />
      </div>
      <div className='flex flex-col justify-center'>
        <h1 className="text-l font-semibold text-slate-800 lg:text-2xl">
          Merveilles Webring RSS
        </h1>
        <h2 className='text-sm font-normal text-slate-600 lg:text-base'>
          Latest updates from the <a href='https://webring.xxiivv.com/#rss' target='_blank' rel='noopener noreferrer' className='font-bold'>Merveilles Webring</a>
        </h2>
      </div>
    </div>
  );
}
