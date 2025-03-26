import './LandingPage.css'
import Navbar from '../../components/navbar/Navbar'
import MusicList from '../../components/musiclist/MusicList';

const LandingPage = () => {
    const handleSearch = () => {};
  
    return (
      <div>
        <Navbar onSearch={handleSearch} />
        <MusicList />
      </div>
    );
  };

export default LandingPage