import landingPageImage from '../assets/Landing Page.png';

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${landingPageImage})` }}
    >
      <div className="flex min-h-screen items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="text-center text-white">
          <h1 className="mb-4 text-5xl font-bold">Welcome to Anambra GeoHub</h1>
          <p className="text-2xl">Exploring Anambra's Geospatial Data</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
