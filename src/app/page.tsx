import Image from 'next/image';

import Eyes from '../../components/Eyes';
import MuteButton from '../../components/MuteButton';

export default function Home() {
  return (
    <>
      <div className='absolute right-0'>
        <MuteButton />
      </div>

      <main className='bg-black w-full h-screen flex py-20 sm:py-48'>
        <div className='flex mx-auto h-max items-center'>
          <Eyes />
        </div>
      </main> 
    </>

  )
}
