import { useState } from 'react';
import { useUserStore } from '../store/userStore';

export default function Profile() {
  const { profile, updateProfile, isLoading, error } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const [successMessage, setSuccessMessage] = useState('');

  if (!profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(localProfile!);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleCancel = () => {
    setLocalProfile(profile);
    setIsEditing(false);
  };

  const updateBasicInfo = (field: string, value: string) => {
    setLocalProfile({
      ...localProfile!,
      basicInfo: {
        ...localProfile!.basicInfo,
        [field]: value,
      },
    });
  };

  const updateHealthProfile = (field: string, value: any) => {
    setLocalProfile({
      ...localProfile!,
      healthProfile: {
        ...localProfile!.healthProfile,
        [field]: value,
      },
    });
  };

  const updateLifestyle = (field: string, value: any) => {
    setLocalProfile({
      ...localProfile!,
      lifestyle: {
        ...localProfile!.lifestyle,
        [field]: value,
      },
    });
  };

  const updateMentalHealth = (field: string, value: any) => {
    setLocalProfile({
      ...localProfile!,
      mentalHealth: {
        ...localProfile!.mentalHealth,
        [field]: value,
      },
    });
  };

  const toggleSecondaryGoal = (goalId: string) => {
    const currentGoals = localProfile!.goals.secondary;
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(g => g !== goalId)
      : [...currentGoals, goalId];
    
    setLocalProfile({
      ...localProfile!,
      goals: {
        ...localProfile!.goals,
        secondary: newGoals,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={localProfile?.basicInfo.name}
                      onChange={(e) => updateBasicInfo('name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.basicInfo.name || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={localProfile?.basicInfo.age}
                      onChange={(e) => updateBasicInfo('age', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.basicInfo.age}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Language</label>
                  {isEditing ? (
                    <select
                      value={localProfile?.basicInfo.language}
                      onChange={(e) => updateBasicInfo('language', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {profile.basicInfo.language === 'en' ? 'English' : 
                       profile.basicInfo.language === 'es' ? 'Español' : 
                       profile.basicInfo.language === 'fr' ? 'Français' : 
                       profile.basicInfo.language}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Health Profile */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Health Profile</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sex</label>
                  {isEditing ? (
                    <select
                      value={localProfile?.healthProfile.sex}
                      onChange={(e) => updateHealthProfile('sex', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.healthProfile.sex}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Menstrual Status</label>
                  {isEditing ? (
                    <select
                      value={localProfile?.healthProfile.menstrualStatus}
                      onChange={(e) => updateHealthProfile('menstrualStatus', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="menstruating">Menstruating</option>
                      <option value="not-menstruating">Not Menstruating</option>
                      <option value="pregnant">Pregnant</option>
                      <option value="postpartum">Postpartum</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.healthProfile.menstrualStatus}</p>
                  )}
                </div>
                {localProfile?.healthProfile.menstrualStatus === 'menstruating' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cycle Regularity</label>
                      {isEditing ? (
                        <select
                          value={localProfile?.healthProfile.cycleRegularity}
                          onChange={(e) => updateHealthProfile('cycleRegularity', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        >
                          <option value="regular">Regular</option>
                          <option value="irregular">Irregular</option>
                          <option value="unknown">Unknown</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-gray-900">{profile.healthProfile.cycleRegularity}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cycle Length (days)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={localProfile?.healthProfile.cycleLength}
                          onChange={(e) => updateHealthProfile('cycleLength', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          min="21"
                          max="35"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{profile.healthProfile.cycleLength} days</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Lifestyle */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lifestyle</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                  {isEditing ? (
                    <select
                      value={localProfile?.lifestyle.activityLevel}
                      onChange={(e) => updateLifestyle('activityLevel', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="moderate">Moderate</option>
                      <option value="active">Active</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.lifestyle.activityLevel}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sleep Pattern</label>
                  {isEditing ? (
                    <select
                      value={localProfile?.lifestyle.sleepPattern}
                      onChange={(e) => updateLifestyle('sleepPattern', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="regular">Regular</option>
                      <option value="irregular">Irregular</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.lifestyle.sleepPattern}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Average Sleep (hours)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={localProfile?.lifestyle.averageSleep}
                      onChange={(e) => updateLifestyle('averageSleep', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      min="4"
                      max="12"
                      step="0.5"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.lifestyle.averageSleep} hours</p>
                  )}
                </div>
              </div>
            </section>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}