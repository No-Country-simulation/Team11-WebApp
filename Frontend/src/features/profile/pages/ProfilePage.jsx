import Side from '../components/ui/SideCardProfile'
import Profile from '../components/CompanyProfile'

const ProfilePage = () => {
    return (
        <main className='flex w-max px-6 justify-center items-center'>
            <Side />
            <Profile />
        </main>
    );
};

export default ProfilePage