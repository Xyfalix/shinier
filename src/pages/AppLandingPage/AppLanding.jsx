import debug from "debug";
import { useState, useEffect } from "react";
import "../App/App.css"
import NavBar from "../../components/NavBar";
import SearchInput from "../../components/SearchInput";
import { getUser } from "../../utilities/users-service";
import cardImageData from "../../cardImageData.json"

const log = debug("mern:src:App");
localStorage.debug = "mern:*";

log("Start React App");

export default function AppLanding() {
  const [user, setUser] = useState(getUser);
  const [landingCardImages, setLandingCardImages] = useState([])

  // Function to shuffle an array randomly (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  useEffect(() => {
    const data = cardImageData.data;
    shuffleArray(data);
    const randomImages = data.slice(0, 6);
    setLandingCardImages(randomImages);
  }, []);

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <div className="min-h-screen flex m-4">
        <div className="flex flex-col justify-center pb-96">
          <p className="mb-20 mx-3 text-4xl font-bold text-center text-violet-500">
            Your One Stop for collecting the coolest and rarest Pokemon Cards
          </p>
          <SearchInput />
        </div>
        <div className="w-screen m-4">
          <div className="grid grid-cols-2 gap-4">
            {landingCardImages.map((landingCardImage, index) => (
              <div key={index} className="relative aspect-w-16 aspect-h-9">
                <img
                  src={landingCardImage.images.small}
                  alt={`Landing Card Image ${index}`}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}