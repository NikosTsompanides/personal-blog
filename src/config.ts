import type { SocialObjects } from "./types";

export const SITE = {
  website: "https://nikos-tsompanidis.netlify.app/",
  author: "Nikos Tsompanidis",
  desc: "Personal blog of Nikos Tsompanidis",
  title: "N. Tsompanidis",
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
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100008309835480",
    linkTitle: `${SITE.title} on Facebook`,
    active: true,
  },
  // {
  //   name: "Instagram",
  //   href: "https://www.instagram.com/nikostsompanides/",
  //   linkTitle: `${SITE.title} on Instagram`,
  //   active: true,
  // },
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
  // {
  //   name: "Twitter",
  //   href: "https://github.com/satnaing/astro-paper",
  //   linkTitle: `${SITE.title} on Twitter`,
  //   active: false,
  // },
];
