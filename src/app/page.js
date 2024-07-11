import Image from 'next/image'
import UploadForm from '../components/form/UploadForm'
import InfoSection from '../components/InfoSection'
import ImgTextCol from '../components/info2/ImgTextCol'

export default function Home() {
  return (
    <div>
      <UploadForm />
      <InfoSection />
      <ImgTextCol />
    </div>
  )
}
