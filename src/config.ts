import type { SocialObjects } from "./types";

export const SITE = {
  website: "https://nikos-tsompanidis.netlify.app/",
  author: "Nikos Tsompanidis",
  desc: "I'm Nikos Tsompanidis, a Software Engineer driven by curiosity who loves diving into new adventures and learning new things!",
  title: "N. Tsompanidis | Personal Blog",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/NikosTsompanides",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/nikolaos-tsompanidis-36bb1711a/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:nikostsompanides@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];
