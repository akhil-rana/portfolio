let position = 'main';
let navBarExpanded = false;
let isMoving = false;
let socialShown = false;
let profileImageLoaded = false;
let currentProject = 1;
let currentExperience = 1;
let nextProjectArrowAnimation = null;
let nextExperienceArrowAnimation = null;

const elements = {
  navBar: document.getElementById('navBar'),
  navLinks: document.querySelectorAll('#navBar li'),
  profileImg: document.querySelector('#profileImage img'),
  currentPos: document.getElementById('currentPosition'),
  nextDownArrow: document.getElementById('nextDownArrow'),
  containerTyping: document.querySelector('.container-typing'),
  menuIconSpan: document.querySelector('#navBar #menuButton #menuIconSpan'),
};

elements.profileImg.classList.add('hover');

const isMobile = () => window.innerWidth <= 700;
const fadeElement = (target, opacity, duration = 0.3) => {
  return gsap.to(target, {
    opacity,
    duration,
    ease: 'power2.inOut',
  });
};

const fadeElementWithDisplay = (
  target,
  opacity,
  duration = 0.3,
  display = 'block'
) => {
  const element =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (opacity === 0) {
    return gsap.to(target, {
      opacity: 0,
      duration,
      ease: 'power2.inOut',
      onComplete: () => {
        if (element) element.style.display = 'none';
      },
    });
  } else {
    if (element) element.style.display = display;
    return gsap.to(target, {
      opacity,
      duration,
      ease: 'power2.inOut',
    });
  }
};
const animateSection = (
  selector,
  translateY,
  duration = 1,
  easing = 'elastic.out(1, 0.6)'
) => {
  return gsap.to(selector, {
    transform: `translateY(${translateY})`,
    duration,
    ease: easing,
  });
};

const setPosition = (newPos) => {
  position = newPos;
  if (newPos !== 'processing') updatePosition(newPos);
};

const updateNavDisplay = () => {
  const mobile = isMobile();
  elements.navLinks.forEach((li) => {
    li.style.display = mobile ? 'none' : 'block';
    if (!mobile) li.style.transform = 'scale(1)';
  });
};

const collapseNav = () => {
  if (navBarExpanded) {
    elements.navLinks.forEach((li) => (li.style.display = 'none'));
    gsap.to(elements.navBar, {
      height: '4em',
      duration: 0.5,
      ease: 'elastic.out(1, 0.7)',
      onComplete: () => (navBarExpanded = false),
    });
  }
};

const updatePosition = (newPos) => {
  const tl = gsap.timeline();
  tl.to(elements.currentPos, {
    opacity: 0,
    duration: 0.3,
  })
    .call(() => {
      elements.currentPos.textContent = newPos;
    })
    .to(elements.currentPos, {
      opacity: 1,
      duration: 0.3,
    });
  return tl;
};

const updateNavHover = (activeId) => {
  document
    .querySelectorAll('nav li span')
    .forEach((span) => span.classList.remove('hover'));
  const activeElement = activeId && document.getElementById(activeId);
  if (activeElement) activeElement.classList.add('hover');
};

const toggleProfileImageHover = (add) =>
  elements.profileImg.classList.toggle('hover', add);

const closeNavIfExpanded = () => {
  if (navBarExpanded) elements.menuIconSpan.click();
};

window.addEventListener('resize', () => {
  updateNavDisplay();
  collapseNav();
});

elements.nextDownArrow.addEventListener('click', goDownArrow);

document.body.onwheel = movePage;
document.onkeydown = movePage;

function movePage(event) {
  if (isMoving) return;
  isMoving = true;

  const { deltaY: move, keyCode: keyPressed } = event;
  const downActions = {
    main: goDownArrow,
    about: goDownFromAbout,
    projects: goDownFromProjects,
    experience: goDownFromExperience,
  };
  const upActions = {
    about: goUpArrow,
    projects: goUpFromProjects,
    experience: goUpFromExperience,
    contact: goUpFromContact,
  };

  if (move > 0 || keyPressed === 40) downActions[position]?.();
  else if (move < 0 || keyPressed === 38) upActions[position]?.();
  else if (keyPressed === 37) {
    if (position === 'projects')
      document
        .querySelector('#previousProject svg')
        ?.dispatchEvent(new Event('click', { bubbles: true }));
    if (position === 'experience')
      document
        .querySelector('#previousExperience svg')
        ?.dispatchEvent(new Event('click', { bubbles: true }));
  } else if (keyPressed === 39) {
    if (position === 'projects')
      document.getElementById('nextProject')?.click();
    if (position === 'experience')
      document.getElementById('nextExperience')?.click();
  }

  setTimeout(() => (isMoving = false), 2000);
}

function goDownArrow() {
  position = 'processing';
  updateNavDisplay();
  fadeElementWithDisplay('#nextDownArrowContainer', 0);
  document.getElementById('themeToggle')?.classList.add('normal');
  
  elements.navBar.style.display = 'block';
  elements.navBar.style.opacity = '0';
  fadeElement('#navBar', 1, 0.8);
  
  animateSection('.container-typing', '-100%', 0.4, 'power2.inOut');
  const aboutAnimation = animateSection('.about', '-100%');
  aboutAnimation.eventCallback('onComplete', () => {
    if (!profileImageLoaded)
      lazyLoadProfileImage().then(() => toggleProfileImageHover(false));
    else toggleProfileImageHover(false);
    updateNavHover('about');
    document.body.style.overscrollBehavior = 'none';
    position = 'about';
  });
}

function goUpArrow() {
  position = 'processing';
  const navFade = fadeElement('#navBar', 0, 0.3);
  navFade.eventCallback('onComplete', () => {
    elements.navBar.style.display = 'none';
  });
  elements.containerTyping.style.display = 'flex';
  updateNavHover('');
  if (navBarExpanded) elements.menuIconSpan.click();
  document.getElementById('themeToggle')?.classList.remove('normal');
  animateSection('.about', 'calc(100% + 6em)', 1.1);
  gsap.to('.container-typing', {
    transform: 'translateY(0%)',
    duration: 1.1,
    ease: 'elastic.out(1, 0.6)',
    onComplete: () => {
      fadeElementWithDisplay('#nextDownArrowContainer', 1, 0.3, 'flex');
      position = 'main';
      toggleProfileImageHover(true);
    },
  });
  document.body.style.overscrollBehavior = 'auto';
}

const sectionTransition = (toPosition, navId, profileHover, callback) => {
  position = 'processing';
  updatePosition(toPosition);
  if (profileHover !== null)
    setTimeout(() => toggleProfileImageHover(profileHover), 400);
  updateNavHover(navId);
  const themeToggle = document.getElementById('themeToggle');
  if (toPosition === 'main') {
    themeToggle?.classList.remove('normal');
  } else {
    themeToggle?.classList.add('normal');
  }
  
  callback?.();
};

const goDownFromAbout = () =>
  sectionTransition('projects', 'projects', false, () => {
    animateSection('.about', 'calc(-200% - 6em)', 0.4, 'power2.inOut');
    movingNextProjectArrow();
  });

const movingNextProjectArrow = () => {
  const projectsAnimation = animateSection('.projects', '-200%', 1);
  projectsAnimation.eventCallback('onComplete', () => {
    position = 'projects';
    if (currentProject === 1) {
      nextProjectArrowAnimation = gsap.to('#nextProject', {
        transform: 'translateX(0.7em)',
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }
  });
};

const goUpFromProjects = () =>
  sectionTransition('about', 'about', false, () => {
    animateSection('.projects', '0%', 0.4, 'power2.inOut');
    gsap.to('.about', {
      transform: 'translateY(-100%)',
      duration: 1,
      ease: 'elastic.out(1, 0.6)',
      onComplete: () => (position = 'about'),
    });
  });

const goDownFromProjects = () =>
  sectionTransition('experience', 'experience', null, () => {
    animateSection('.projects', 'calc(-300% - 6em)', 0.4, 'power2.inOut');
    const experienceAnimation = animateSection('.experience', '-300%', 1);
    experienceAnimation.eventCallback('onComplete', () => {
      position = 'experience';
      movingNextExperienceArrow();
    });
  });

const goUpFromExperience = () =>
  sectionTransition('projects', 'projects', null, () => {
    animateSection('.experience', '0%', 0.4, 'power2.inOut');
    gsap.to('.projects', {
      transform: 'translateY(-200%)',
      duration: 1,
      ease: 'elastic.out(1, 0.6)',
      onComplete: () => (position = 'projects'),
    });
    movingNextProjectArrow();
  });

const fromAboutToExperience = () =>
  sectionTransition('experience', 'experience', true, () => {
    animateSection('.about', 'calc(-200% - 6em)', 0.4, 'power2.inOut');
    animateSection('.projects', 'calc(-300% - 6em)', 0, 'power2.inOut');
    const experienceAnimation = animateSection('.experience', '-300%', 1);
    experienceAnimation.eventCallback('onComplete', () => {
      position = 'experience';
      movingNextExperienceArrow();
    });
  });

const fromExperienceToAbout = () =>
  sectionTransition('about', 'about', false, () => {
    animateSection('.experience', '0%', 0.4, 'power2.inOut');
    animateSection('.projects', '0%', 0, 'power2.inOut');
    gsap.to('.about', {
      transform: 'translateY(-100%)',
      duration: 1,
      ease: 'elastic.out(1, 0.6)',
      onComplete: () => (position = 'about'),
    });
  });

const goDownFromExperience = () =>
  sectionTransition('contact', 'contact', null, () => {
    animateSection('.experience', 'calc(-400% - 6em)', 0.4, 'power2.inOut');
    animateSection('.contact', '-400%', 1);
    setTimeout(() => (position = 'contact'), 1000);
  });

const goUpFromContact = () =>
  sectionTransition('experience', 'experience', null, () => {
    animateSection('.contact', '0%', 0.4, 'power2.inOut');
    gsap.to('.experience', {
      transform: 'translateY(-300%)',
      duration: 1,
      ease: 'elastic.out(1, 0.6)',
      onComplete: () => {
        position = 'experience';
        movingNextExperienceArrow();
      },
    });
  });

const fromAboutToContact = () =>
  sectionTransition('contact', 'contact', true, () => {
    animateSection('.about', 'calc(-200% - 6em)', 0.4, 'power2.inOut');
    animateSection('.projects', 'calc(-300% - 6em)', 0, 'power2.inOut');
    animateSection('.experience', 'calc(-400% - 6em)', 0, 'power2.inOut');
    animateSection('.contact', '-400%', 1);
    setTimeout(() => (position = 'contact'), 1000);
  });

const fromContactToAbout = () =>
  sectionTransition('about', 'about', false, () => {
    animateSection('.contact', '0%', 0.4, 'power2.inOut');
    animateSection('.experience', '0%', 0, 'power2.inOut');
    animateSection('.projects', '0%', 0, 'power2.inOut');
    gsap.to('.about', {
      transform: 'translateY(-100%)',
      duration: 1,
      ease: 'elastic.out(1, 0.6)',
      onComplete: () => (position = 'about'),
    });
  });

const fromContactToProjects = () =>
  sectionTransition('projects', 'projects', false, () => {
    animateSection('.contact', '0%', 0.4, 'power2.inOut');
    animateSection('.experience', '0%', 0, 'power2.inOut');
    gsap.to('.projects', {
      transform: 'translateY(-200%)',
      duration: 1,
      ease: 'elastic.out(1, 0.6)',
      onComplete: () => (position = 'projects'),
    });
  });

const fromProjectsToContact = () =>
  sectionTransition('contact', 'contact', null, () => {
    animateSection('.projects', 'calc(-300% - 6em)', 0.4, 'power2.inOut');
    animateSection('.experience', 'calc(-400% - 6em)', 0, 'power2.inOut');
    animateSection('.contact', '-400%', 1);
    setTimeout(() => (position = 'contact'), 1000);
  });

const navigationRoutes = {
  projects: {
    about: goDownFromAbout,
    experience: goUpFromExperience,
    contact: fromContactToProjects,
  },
  about: {
    projects: goUpFromProjects,
    experience: fromExperienceToAbout,
    contact: fromContactToAbout,
  },
  experience: {
    projects: goDownFromProjects,
    about: fromAboutToExperience,
    contact: goUpFromContact,
  },
  contact: {
    about: fromAboutToContact,
    experience: goDownFromExperience,
    projects: fromProjectsToContact,
  },
};

['projects', 'about', 'experience', 'contact'].forEach((section) => {
  document.getElementById(section).addEventListener('click', () => {
    navigationRoutes[section]?.[position]?.();
    closeNavIfExpanded();
  });
});

elements.menuIconSpan.addEventListener('click', () => {
  const menuButton = document.getElementById('menuButton');
  if (!navBarExpanded) {
    elements.navLinks.forEach((li) => {
      li.style.display = 'block';
      gsap.set(li, { opacity: 0 });
    });

    gsap.to(elements.navBar, {
      height: '20em',
      duration: 0.8,
      ease: 'elastic.out(1, 0.6)',
      onComplete: () => (navBarExpanded = true),
    });

    elements.navLinks.forEach((li, index) => {
      gsap.to(li, {
        opacity: 1,
        duration: 0.4,
        delay: 0.1 + index * 0.1,
        ease: 'power2.out',
      });
    });

    elements.navBar.style.backdropFilter = 'blur(8px)';
    elements.navBar.style.webkitBackdropFilter = 'blur(8px)';

    const menuIcon = menuButton.querySelector('svg.feather.feather-menu');
    if (menuIcon) menuIcon.outerHTML = feather.icons.x.toSvg();

    gsap.to('#menuButton #menuIconSpan svg', {
      rotation: 90,
      duration: 0.8,
      ease: 'elastic.out(1, 0.6)',
    });
  } else {
    elements.navLinks.forEach((li) => (li.style.display = 'none'));
    gsap.to(elements.navBar, {
      height: '4em',
      duration: 0.5,
      ease: 'elastic.out(1, 0.7)',
      onComplete: () => {
        navBarExpanded = false;
        elements.navBar.style.backdropFilter = 'blur(3px)';
        elements.navBar.style.webkitBackdropFilter = 'blur(3px)';
      },
    });

    const xIcon = menuButton.querySelector('svg.feather.feather-x');
    if (xIcon) xIcon.outerHTML = feather.icons.menu.toSvg();

    const iconSpan = document.querySelector('#menuButton #menuIconSpan svg');
    gsap.set(iconSpan, { rotation: 90 });
    gsap.to('#menuButton #menuIconSpan svg', {
      rotation: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.6)',
    });
  }
});

const projectData = {
  names: [
    'Pathology Algorithm Development Workbench',
    'virtual-bg',
    'Peerivate',
    'This Website',
  ],
  descriptions: [
    'Selected as one of 1,200 students worldwide for Google Summer of Code 2020 to develop a Pathology Algorithm Development Workbench for caMicroscope. Enabled users to train their own ML models using an interactive UI, choose training data from pre-existing caMicroscope data or custom datasets, with an interactive interface for designing algorithms from scratch using TensorFlow.js for real-time machine learning model training and deployment.',
    'Developed and maintained an open-source npm package with over 20,000 total downloads, providing seamless virtual background effects for video/camera input within web browsers using MediaPipe for real-time person segmentation. Features include customizable background images, blur effects, edge smoothing, and optimized performance for real-time video processing, supporting multiple frameworks and demonstrating scalability in production environments.',
    'Architected and developed a fully custom, end-to-end encrypted and anonymous peer-to-peer audio/video calling platform using WebRTC, React, and Node.js with DTLS-SRTP encryption and perfect forward secrecy. Key features include real-time video/audio streaming, screen sharing, presenter mode, automatic connection recovery, and global CDN distribution optimized for low-latency communication.',
    'A responsive personal portfolio website built with vanilla JavaScript, CSS animations, and modern web technologies. Features include smooth section transitions, touch/swipe navigation, progressive web app capabilities, dark theme support, and optimized performance with service worker caching for an engaging user experience.',
  ],
  githubStatus: [false, true, true, true],
  deployStatus: [false, true, true, false],
  githubLinks: [
    'https://summerofcode.withgoogle.com/archive/2020/projects/6656365486931968',
    'https://github.com/akhil-rana/virtual-bg',
    'https://github.com/akhil-rana/peerivate',
    'https://github.com/akhil-rana/portfolio',
  ],
  deployLinks: [
    '',
    'https://demo.virtualbg.akhilrana.com/',
    'https://peerivate.akhilrana.com/',
    'https://akhilrana.com/',
  ],
};

document.getElementById('nextProject').addEventListener('click', () => {
  if (currentProject < projectData.names.length + 1) goToNextProject();
});
document.getElementById('previousProject').addEventListener('click', () => {
  if (currentProject > 1) goToPreviousProject();
});

const updateProjectContent = (
  name,
  description,
  githubLink,
  deployLink,
  showDeploy,
  isGithubRepo = true
) => {
  const elements = {
    name: document.getElementById('projectName'),
    description: document.getElementById('projectDescription'),
    github: document.getElementById('projectGithub'),
    deployment: document.getElementById('projectDeployment'),
  };

  const fadeOut = fadeElement(Object.values(elements), 0, 0.4);
  fadeOut.eventCallback('onComplete', () => {
    elements.name.textContent = name;
    elements.description.textContent = description;
    elements.github.href = githubLink;
    elements.deployment.style.display = showDeploy ? 'inline-block' : 'none';
    if (showDeploy) elements.deployment.href = deployLink;

    if (isGithubRepo) {
      elements.github.innerHTML = '<i data-feather="github"></i>';
      elements.github.setAttribute('aria-label', 'Github Icon');
    } else {
      elements.github.innerHTML = '<i data-feather="external-link"></i>';
      elements.github.setAttribute('aria-label', 'Project link');
    }

    if (typeof feather !== 'undefined') feather.replace();
    fadeElement(Object.values(elements), 1, 0.4);
  });
};

const updateProjectNavigation = () => {
  const prevEl = document.getElementById('previousProject');
  const nextEl = document.getElementById('nextProject');
  prevEl.style.display = currentProject > 1 ? 'block' : 'none';
  nextEl.style.display =
    currentProject < projectData.names.length ? 'block' : 'none';
};

const goToNextProject = () => {
  const nextEl = document.getElementById('nextProject');
  if (currentProject === 1 && nextProjectArrowAnimation) {
    nextProjectArrowAnimation.progress(0);
    gsap.killTweensOf('#nextProject');
    gsap.set('#nextProject', { transform: 'translateX(0)' });
  }

  if (currentProject === projectData.names.length) {
    updateProjectContent(
      'You might find some more on my github account :)',
      '',
      'https://github.com/akhil-rana/',
      '',
      false,
      false
    );
    nextEl.style.display = 'none';
    currentProject++;
  } else if (currentProject < projectData.names.length) {
    const project = projectData.names[currentProject];
    updateProjectContent(
      project,
      projectData.descriptions[currentProject],
      projectData.githubLinks[currentProject],
      projectData.deployLinks[currentProject],
      projectData.deployStatus[currentProject],
      projectData.githubStatus[currentProject]
    );
    currentProject++;
    updateProjectNavigation();
  }
};

const goToPreviousProject = () => {
  if (currentProject > 1) {
    currentProject--;
    const project = projectData.names[currentProject - 1];
    updateProjectContent(
      project,
      projectData.descriptions[currentProject - 1],
      projectData.githubLinks[currentProject - 1],
      projectData.deployLinks[currentProject - 1],
      projectData.deployStatus[currentProject - 1],
      projectData.githubStatus[currentProject - 1]
    );
    updateProjectNavigation();
  }
};

const createToggleFunction = (
  showCondition,
  hideElements,
  showElements,
  getDisplay
) => {
  gsap.to(hideElements, {
    opacity: 0,
    duration: 0.25,
    ease: 'power2.inOut',
    onComplete: () => {
      hideElements.forEach((el) => (el.style.display = 'none'));
      showElements.forEach((el, index) => {
        el.style.display = getDisplay ? getDisplay(el, index) : 'block';
        el.style.opacity = '0';
      });
      setTimeout(
        () =>
          gsap.to(showElements, {
            opacity: 1,
            duration: 0.35,
            ease: 'power2.inOut',
          }),
        50
      );
      showCondition?.();
    },
  });
};

function lazyLoadProfileImage() {
  return new Promise((resolve) => {
    fetch('https://ik.imagekit.io/at6kwvrzots/me_m8TQcP9Y8.webp')
      .then((res) => res.blob())
      .then((blob) => {
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
        elements.profileImg.src = imageUrl;
        profileImageLoaded = true;

        const imageLoading = document.getElementById('ImageLoading');
        gsap.to(imageLoading, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => (imageLoading.style.display = 'none'),
        });
        resolve();
      });
  });
}

const sendMail = async () => {
  const data = JSON.stringify({
    name: document.getElementById('nameOfSender').value,
    email: document.getElementById('emailOfSender').value,
    message: document.getElementById('emailMessage').value,
  });

  try {
    const configResponse = await fetch('./utils/config.json');
    const config = await configResponse.json();

    const response = await fetch(
      config.PORTFOLIO_BACKEND_BASE_URL + '/sendMessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        redirect: 'follow',
      }
    );

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.log('error', error);
  }
};

const toggleContactView = (showSocial) => {
  const elements = {
    goToSocial: document.getElementById('goToSocial'),
    sendMessageBox: document.getElementById('sendMessageBox'),
    goToMessage: document.getElementById('goToMessage'),
    socialBox: document.getElementById('socialBox'),
  };

  const hideElements = showSocial
    ? [elements.goToSocial, elements.sendMessageBox]
    : [elements.goToMessage, elements.socialBox];
  const showElements = showSocial
    ? [elements.goToMessage, elements.socialBox]
    : [elements.goToSocial, elements.sendMessageBox];
  createToggleFunction(
    () => (socialShown = showSocial),
    hideElements,
    showElements,
    (el) => {
      return el.id === 'goToMessage' ? 'flex' : 'block';
    }
  );
};

document
  .getElementById('goToSocial')
  .addEventListener('click', () => toggleContactView(true));
document
  .getElementById('goToMessage')
  .addEventListener('click', () => toggleContactView(false));

const socialLinks = {
  linkedin: 'https://www.linkedin.com/in/rana-akhil/',
  telegram: 'https://t.me/AkhilRana',
  medium: 'https://medium.com/@akhilrana0001',
  github: 'https://github.com/akhil-rana',
};

const toggleSocialLinks = (activate) => {
  setTimeout(() => {
    Object.keys(socialLinks).forEach((platform) => {
      const link = document.querySelector(`#${platform} a`);
      if (link) link.href = activate ? socialLinks[platform] : '#';
    });
  }, 800);
};

document.querySelectorAll('.social-btn').forEach((btn) => {
  btn.addEventListener('mouseenter', () => toggleSocialLinks(true));
  btn.addEventListener('mouseleave', () => toggleSocialLinks(false));
});

const experienceData = [
  {
    company: '',
    position: 'Software Engineer - 2',
    date: 'June 2024 - Present',
    icon: './assets/company-icons/junper.webp',
    description:
      'Maintained and enhanced <a href="https://www.juniper.net/documentation/us/en/software/mist/mist-aiops/topics/topic-map/marvis-client-macos.html" target="_blank" style="text-decoration: none; color: white; border-bottom: 0.2px dashed rgba(255, 255, 255, 0.39);">Marvis Client</a> applications for enterprise Wi-Fi environments using SwiftUI and UIKit. Implemented telemetry collection using CoreWLAN frameworks and built automated network onboarding workflows. Developed Marvis-CLI tool for network diagnostics and created silent auto-upgrade mechanisms for BYOD devices.',
  },
  {
    company: '',
    position: 'Software Engineering Intern',
    date: 'July 2023 - June 2024',
    icon: './assets/company-icons/junper.webp',
    description:
      'Developed <a href="https://github.com/mistsys/mist-vble-ios-sdk/wiki" target="_blank" style="text-decoration: none; color: white; border-bottom: 0.2px dashed rgba(255, 255, 255, 0.39);">Mist Indoor Location SDK</a> sample applications and React Native implementations for cross-platform location services. Focused specifically on indoor positioning and location-based services integration.',
  },
  {
    company: 'SquareBoat',
    position: 'Software Engineer',
    date: 'July 2021 - February 2022',
    icon: './assets/company-icons/squareboat.webp',
    description:
      'Led development of production applications using NestJS backend with TypeScript and PostgreSQL/MySQL databases. Redesigned <a href="https://proactiveforher.com" target="_blank" style="text-decoration: none; color: white; border-bottom: 0.2px dashed rgba(255, 255, 255, 0.39);">Proactive For Her</a> platform architecture implementing microservices with 3 React-based frontends. Built custom scheduling and payment system reducing SaaS spend by 80%.',
  },
  {
    company: 'GSoC',
    position: 'Project Developer & Mentor',
    date: '2020 & 2021',
    icon: './assets/company-icons/gsoc.webp',
    description:
      'Selected as one of 1,200 students worldwide for Google Summer of Code 2020 to develop a <a href="https://summerofcode.withgoogle.com/archive/2020/projects/6656365486931968" target="_blank" style="text-decoration: none; color: white; border-bottom: 0.2px dashed rgba(255, 255, 255, 0.39);">Pathology Algorithm Development Workbench</a> for <a href="https://camicroscope.org/" target="_blank" style="text-decoration: none; color: white; border-bottom: 0.2px dashed rgba(255, 255, 255, 0.39);">caMicroscope</a>. Later served as project mentor for GSoC 2021, guiding developers in creating a <a href="https://summerofcode.withgoogle.com/archive/2021/projects/6434317655343104" target="_blank" style="text-decoration: none; color: white; border-bottom: 0.2px dashed rgba(255, 255, 255, 0.39);">real-time collaborative pathology platform</a>.',
  },
];

document.getElementById('nextExperience').addEventListener('click', () => {
  if (currentExperience < experienceData.length) goToNextExperience();
});
document.getElementById('previousExperience').addEventListener('click', () => {
  if (currentExperience > 1) goToPreviousExperience();
});

const updateExperienceContent = (experience) => {
  const elements = {
    company: document.querySelector('#experienceCompany span'),
    position: document.getElementById('experiencePosition'),
    date: document.getElementById('experienceDate'),
    description: document.getElementById('experienceDescription'),
    icon: document.querySelector('#experienceCompany img'),
  };

  const fadeOut = fadeElement(Object.values(elements), 0, 0.4);
  fadeOut.eventCallback('onComplete', () => {
    elements.company.textContent = experience.company;
    elements.company.style.display = experience.company ? 'inline' : 'none';
    elements.position.textContent = experience.position;
    elements.date.textContent = experience.date;
    elements.description.innerHTML = experience.description;
    elements.icon.src = experience.icon;
    elements.icon.alt = experience.company || 'Company Logo';
    fadeElement(Object.values(elements), 1, 0.4);
  });
};

const updateExperienceNavigation = () => {
  const prevEl = document.getElementById('previousExperience');
  const nextEl = document.getElementById('nextExperience');

  prevEl.style.display = currentExperience > 1 ? 'block' : 'none';
  nextEl.style.display =
    currentExperience < experienceData.length ? 'block' : 'none';
};

const goToNextExperience = () => {
  const nextEl = document.getElementById('nextExperience');
  if (currentExperience === 1 && nextExperienceArrowAnimation) {
    nextExperienceArrowAnimation.progress(0);
    gsap.killTweensOf('#nextExperience');
    gsap.set('#nextExperience', { transform: 'translateX(0)' });
  }

  if (currentExperience < experienceData.length) {
    updateExperienceContent(experienceData[currentExperience]);
    currentExperience++;
    updateExperienceNavigation();
  }
};

const goToPreviousExperience = () => {
  if (currentExperience > 1) {
    currentExperience--;
    updateExperienceContent(experienceData[currentExperience - 1]);
    updateExperienceNavigation();
  }
};

const movingNextExperienceArrow = () => {
  if (currentExperience === 1) {
    nextExperienceArrowAnimation = gsap.to('#nextExperience', {
      transform: 'translateX(0.7em)',
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }
};

const initializeNextDownArrow = () => {
  const nextDownArrowContainer = document.getElementById(
    'nextDownArrowContainer'
  );
  if (position === 'main') {
    nextDownArrowContainer.style.display = 'flex';
    nextDownArrowContainer.style.opacity = '1';
  } else {
    nextDownArrowContainer.style.display = 'none';
    nextDownArrowContainer.style.opacity = '0';
  }
};

const initializeExperienceContent = () => {
  const firstExperience = experienceData[0];

  updateExperienceContent(firstExperience);
  updateExperienceNavigation();
};

const initializeProjectContent = () => {
  updateProjectContent(
    projectData.names[0],
    projectData.descriptions[0],
    projectData.githubLinks[0],
    projectData.deployLinks[0],
    projectData.deployStatus[0],
    projectData.githubStatus[0]
  );
  updateProjectNavigation();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeNextDownArrow();
    initializeExperienceContent();
    initializeProjectContent();
  });
} else {
  initializeNextDownArrow();
  initializeExperienceContent();
  initializeProjectContent();
}
