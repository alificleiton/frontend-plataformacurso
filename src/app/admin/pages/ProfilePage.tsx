import { useRouter } from 'next/navigation';
import { useProfile } from '../hooks/useProfile';
import { EditProfileForm } from '../components/Profile/EditProfileForm';

interface ProfilePageProps {
  user: any;
}

export const ProfilePage = ({ user }: ProfilePageProps) => {
  const router = useRouter();
  const {
    profileForm,
    selectedImage,
    error,
    setSelectedImage,
    handleProfileFormChange,
    handleProfileUpdate
  } = useProfile(user);

  const handleSubmit = async (e: React.FormEvent) => {
    const success = await handleProfileUpdate(e);
    if (success) {
      router.refresh(); // Atualiza os dados do usuário
    }
  };

  return (
    <EditProfileForm
      user={user}
      profileForm={profileForm}
      onFormChange={handleProfileFormChange}
      onImageChange={setSelectedImage}
      onSubmit={handleSubmit}
      error={error}
    />
  );
};