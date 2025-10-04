import NavigationBar from "../../components/general/NavBar";
import Header from "../../components/home/Headers/Header";
import StartBuildButton from "../../components/home/StartBuildBtn/StartBuildButton";
import DesriptionCard from "../../components/home/DescriptionCard/DescriptionCard";
import TextBlock from "../../components/home/TextBlock/TextBlock";
import PhotoCard from "../../components/home/PhotoCard/PhotoCard";
import "../../components/general/PageStyles.css";

function Home() {
    return (
        <div className="home-page">
            <NavigationBar />
            <main>
                <Header>Створи свій космічний дім. Почни подорож до зірок вже зараз!</Header>
                <StartBuildButton />
                <Header>Як це працює?</Header>
                <div className="des-card-container">
                    <DesriptionCard head="Конструюй" text="створи форму корабля у 2D-редакторі"></DesriptionCard>
                    <DesriptionCard head="Конструюй" text="створи форму корабля у 2D-редакторі"></DesriptionCard>
                    <DesriptionCard head="Запускай" text="дізнайся, чи готовий твій дім до подорожі"></DesriptionCard>
                </div>
                <Header>Навіщо це?</Header>
                <div className="block">
                    <TextBlock>Наш сайт — це не лише розвага. Це спосіб уявити майбутнє, спробувати себе у ролі дослідника та відчути, що космос ближче, ніж здається.</TextBlock>
                </div>
                <Header>Хто ми?</Header>
                <div className="flex-container">
                    <div className="cards-flex">
                        <PhotoCard />
                        <PhotoCard />
                        <PhotoCard />
                        <PhotoCard />
                        <PhotoCard />
                        <PhotoCard />
                    </div>
                    <div className="about-us">
                        <TextBlock>Ми — команда NovaVision, студенти-ентузіасти з університету. Створили цей сайт, щоб зробити космос ближчим і цікавішим для кожного.</TextBlock>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;