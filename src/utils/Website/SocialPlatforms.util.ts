import { InstagramLink, YouTubeLink } from "./Footer.util";
import InstagramSVG from "../../app/(components)/Components/SVG/Instagram";
import YouTubeSVG from "../../app/(components)/Components/SVG/YouTube";
import { SocialPlatform } from "../../types/Website/SocialPlatforms.type";

const socialPlatforms: SocialPlatform[] = [
  {
    name: "instagram",
    icon: InstagramSVG,
    link: InstagramLink,
    gradient: "from-purple-500 via-pink-500 to-orange-500",
    hoverGradient: "from-purple-600 via-pink-600 to-orange-600",
    title: "Follow us",
    subtitle: "See our latest updates!",
    pingColor: "from-purple-500 via-pink-500 to-orange-500",
  },
  {
    name: "youtube",
    icon: YouTubeSVG,
    link: YouTubeLink,
    gradient: "from-red-500 to-red-600",
    hoverGradient: "from-red-600 to-red-700",
    title: "Subscribe",
    subtitle: "Watch our videos!",
    pingColor: "from-red-500 to-red-600",
  },
];

export default socialPlatforms;
