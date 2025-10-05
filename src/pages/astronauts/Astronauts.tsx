import { motion } from "framer-motion";
import AstroBar from "../../components/astronauts/AstroCards/AstroBar";
import AstroSearchBar from "../../components/astronauts/AstroSearchBar/AstroSearchBar";
import NavigationBar from "../../components/general/NavBar";

function Astronauts() {
  return (
    <div className="home-page">
      <NavigationBar />
      <main>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <AstroSearchBar />
          <AstroBar />
        </motion.div>
      </main>
    </div>
  );
}
export default Astronauts;
