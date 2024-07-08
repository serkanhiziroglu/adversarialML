// src/app/page.js

import UploadForm from '../components/form/UploadForm'
import InfoSection from '../components/InfoSection'

export default function Home() {
  return (
    <div>
      <UploadForm />
      <InfoSection />
    </div>
  )
}