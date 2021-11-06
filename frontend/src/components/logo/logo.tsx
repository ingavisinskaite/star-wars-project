import logo from "../../assets/images/logo.svg";

type LogoProps = {
    isCrawlActive: boolean
}

const Logo = ({isCrawlActive}: LogoProps) => {
    return (
        <img id="logo" alt="star-wars-logo" src={logo} className={`star-wars-logo ${isCrawlActive ? "logo-active" : ""}`} />
    );
};

export default Logo;