import { PetUploadForm } from '@/components/admin/PetUploadForm'

export default function NewPetPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Add pet</h1>
      <PetUploadForm />
    </div>
  )
}
