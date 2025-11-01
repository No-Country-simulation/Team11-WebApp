import CompanyProfile from '../../profile/components/CompanyProfile';
import SideCardProfile from '../../profile/components/ui/SideCardProfile';

const PymeCompanyPanelPage = () => {
  return (
    <div className="flex max-w-7xl py-8 mx-auto">
      <SideCardProfile/>
      <CompanyProfile />
    </div>
  );
};

export default PymeCompanyPanelPage;
