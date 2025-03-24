import './LandingPage.css'
import Navbar from '../../components/navbar/Navbar'

const LandingPage = () => {
    const handleSearch = () => {};
  
    return (
      <div>
        <Navbar onSearch={handleSearch} />
      </div>
    );
  };

export default LandingPage