import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUserStore } from '../store/userStore';
import LanguageSelector from './LanguageSelector';

export default function Navigation() {
  const { t } = useTranslation();
  const { profile } = useUserStore();

  const navigation = [
    { 
      name: profile ? t('navigation.dashboard') : t('navigation.home'), 
      href: profile ? '/dashboard' : '/' 
    },
    { name: t('navigation.symptomChecker'), href: '/symptom-checker' },
    { name: t('navigation.periodTracker'), href: '/period-tracker' },
    { name: t('navigation.mentalHealth'), href: '/mental-health' },
    { name: t('navigation.facilities'), href: '/healthcare-facilities' },
    { name: t('navigation.community'), href: '/community' },
    { name: t('navigation.resources'), href: '/resources' },
  ];

  return (
    <Disclosure as="nav" className="bg-white shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to={profile ? '/dashboard' : '/'} className="text-2xl font-bold text-purple-600">
                    Solace
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-purple-600"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <LanguageSelector />
                {profile && (
                  <Link
                    to="/profile"
                    className="text-sm font-medium text-gray-900 hover:text-purple-600"
                  >
                    {profile.basicInfo.name || t('navigation.profile')}
                  </Link>
                )}
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-purple-500 hover:bg-gray-50 hover:text-gray-700"
                >
                  {item.name}
                </Link>
              ))}
              {profile && (
                <Link
                  to="/profile"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-purple-500 hover:bg-gray-50 hover:text-gray-700"
                >
                  {profile.basicInfo.name || t('navigation.profile')}
                </Link>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}