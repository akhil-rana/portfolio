let position = 'main';
let navBarExpanded = false;

$(document).ready(() => {
  $('#profileImage img').addClass('hover');
});

$(window).resize(() => {
  let deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (deviceWidth <= 700) {
    $('#navBar li').hide();
  } else {
    $('#navBar li').css('transform', 'scale(1)').fadeIn();
  }
  if (navBarExpanded) {
    $('#navBar li').hide();
    $('#navBar').animate({ height: '4em' }, 300, () => {
      navBarExpanded = false;
    });
  }
});

$('#nextDownArrow svg').click(() => {
  goDownArrow();
});

$('#projects').click(() => {
  if (position == 'about') {
    goDownFromAbout();
  }
  if (navBarExpanded) {
    setTimeout(() => {
      $('#navBar #menuButton #menuIconSpan').click();
    }, 400);
  }
});

$('#about').click(() => {
  if (position == 'projects') {
    goUpFromProjects();
  }
  if (navBarExpanded) {
    setTimeout(() => {
      $('#navBar #menuButton #menuIconSpan').click();
    }, 400);
  }
});

document.querySelector('body').onwheel = movePage;
document.onkeydown = movePage;

function movePage(event) {
  let move = event.deltaY || null;
  let keyPressed = event.keyCode || null;
  if (move > 0 || keyPressed === 40) {
    if (position == 'main') goDownArrow();
    if (position == 'about') goDownFromAbout();
  } else if (move < 0 || keyPressed === 38) {
    if (position == 'about') goUpArrow();
    if (position == 'projects') goUpFromProjects();
  } else if (keyPressed === 37) {
    if (position == 'projects') $('#previousProject svg').click();
  } else if (keyPressed === 39) {
    if (position == 'projects') $('#nextProject svg').click();
  }
  move = keyPressed = null;
}

function goDownArrow() {
  position = 'processing';
  let deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (deviceWidth <= 700) $('#navBar li').hide();
  if (deviceWidth > 700) $('#navBar li').show();
  $('#nextDownArrow').fadeOut();
  // $('.about').css('display', 'flex');
  anime({
    targets: '.container-typing',
    translateY: '-100%',
    duration: 400,
    easing: 'easeInOutQuad',
    complete: function () {
      anime({
        targets: '#navBar li',
        scale: '1.3',
        duration: 200,
        direction: 'alternate',
        easing: 'easeInOutSine',
        complete: function () {
          $('nav li span').removeClass('hover');
          $('#about').addClass('hover');
          $('body').css('overscroll-behavior', 'none');
          // $('.container-typing').hide();
          position = 'about';
          $('#profileImage img').removeClass('hover');
          $('#navBar').fadeIn();
        },
      });
    },
  });
  anime({
    targets: '.about',
    translateY: '-100%',
    duration: 1000,
    easing: 'easeOutElastic(1, 0.6)',
    complete: function () {},
  });
}

function goUpArrow() {
  position = 'processing';
  $('#navBar').fadeOut();
  $('.container-typing').show();
  $('#about').removeClass('hover');
  if (navBarExpanded) $('#navBar #menuButton #menuIconSpan').click();
  anime({
    targets: '.about',
    translateY: '100%',
    duration: 1100,
    // easing: 'easeInOutSine',
    complete: function () {
      $('#nextDownArrow').fadeIn();
      position = 'main';
      $('#profileImage img').addClass('hover');
    },
  });
  anime({
    targets: '.container-typing',
    translateY: '0%',
    duration: 1100,
  });
  $('body').css('overscroll-behavior', 'auto');
}

function goDownFromAbout() {
  position = 'processing';
  $('#currentPosition').fadeOut(function () {
    $(this).text('Projects').fadeIn();
  });
  anime({
    targets: '.about',
    translateY: 'calc(-200% - 6em)',
    duration: 200,
    easing: 'easeInOutQuad',
    complete: function () {
      $('#profileImage img').addClass('hover');
    },
  });
  anime({
    targets: '.projects',
    translateY: '-200%',
    duration: 900,
    // delay: 50,
    easing: 'easeOutElastic(1, 0.6)',
    complete: function () {
      position = 'projects';
    },
  });
  $('nav li span').removeClass('hover');
  $('#projects').addClass('hover');
}

function goUpFromProjects() {
  position = 'processing';
  $('#currentPosition').fadeOut(function () {
    $(this).text('About').fadeIn();
  });
  anime({
    targets: '.projects',
    translateY: '100%',
    duration: 400,
    easing: 'easeInOutQuad',
    complete: function () {
      $('#profileImage img').removeClass('hover');
    },
  });
  anime({
    targets: '.about',
    translateY: ['calc(-200% - 6em)', '-100%'],
    duration: 1000,
    // direction: 'reverse',
    complete: function () {
      position = 'about';

    },
  });
  $('nav li span').removeClass('hover');
  $('#about').addClass('hover');
}

$('#navBar #menuButton #menuIconSpan').click(() => {
  if (!navBarExpanded) {
    $('#navBar').animate({ height: '20em' }, 300, () => {
      navBarExpanded = true;
      $('#navBar li').fadeIn();
    });
    $('#navBar').css('backdrop-filter', 'blur(8px)');
    $('#navBar').css('-webkit-backdrop-filter', 'blur(8px)');
    $('#menuButton svg.feather.feather-menu').replaceWith(
      feather.icons.x.toSvg()
    );
    anime({
      targets: '#menuButton #menuIconSpan svg',
      rotate: '90deg',
      duration: 700,
    });
  } else {
    $('#navBar li').hide();
    $('#navBar').animate({ height: '4em' }, 300, () => {
      navBarExpanded = false;
      $('#navBar').css('backdrop-filter', 'blur(3px)');
      $('#navBar').css('-webkit-backdrop-filter', 'blur(3px)');
    });
    $('#menuButton svg.feather.feather-x').replaceWith(
      feather.icons.menu.toSvg()
    );
    $('#menuButton #menuIconSpan svg').css('transform', 'rotate(90deg)');
    anime({
      targets: '#menuButton #menuIconSpan svg',
      rotate: '0deg',
      duration: 700,
    });
  }
});

let currentProject = 1;
let projectNames = [
  'YT-Downloader-Backend',
  'YT-Downloader',
  'WebSight',
  'WebSight-Backend',
  'Google Search Scraper',
  'D-Learn',
  'Angular-to-do',
  'And this Website'
];
let projectDescriptions = [
  'A nodeJS utility for downloading youtube videos using ytdl-core and fluent-ffmpeg with support for splitting and downloading chunk files from youtube servers for more speed.',
  'The frontend for the (YT-Downloader-backend) made using basic HTML, jQuery, Bootstrap',
  'Allowing visually and physically impaired individuals to perform certain web-tasks with ease without need of any personalized software/hardware all within a web browser. Used native web-speech API to perform all these tasks using only voice commands.',
  'The nodeJS consolidated backend for WebSight which is responsible for scraping web sites like google.com, news.google.com, wikipedia etc. Used for google translate functionality too.',
  'A really simple NodeJS project to scrape search results from google.com and return them in JSON format using Puppeteer and Cheerio.',
  'A simple design based implementation for a distance learning android app. Implemented various features like course completion status, YouTube API support, WebView integration, Login/signup functionality, user profile update, password reset and Admin dashboard etc.',
  'A simple frontend To-do list made using material-angular with dark theme support and ready for Heroku deployment.',
  'A simple yet beautiful personal portfolio website with dark theme support made without using any frontend libraries. Everything implemented with core CSS, JS, jQuery etc.'
];

let projectsDeployStatus = [false, true, true, false, false, false, true, false];
let projectsGithubLinks = [
  'https://github.com/akhil-rana/YT-Downloader-Backend',
  'https://github.com/akhil-rana/YT-Downloader',
  'https://github.com/akhil-rana/WebSight',
  'https://github.com/akhil-rana/WebSight-backend',
  'https://github.com/akhil-rana/Google-Scrape-NodeJS',
  'https://github.com/akhil-rana/D-Learn',
  'https://github.com/akhil-rana/Angular-to-do',
  'https://github.com/akhil-rana/akhil-rana.github.io',
];
let projectsDeployLinks = [ '',
  'https://akhil-rana.github.io/YT-Downloader',
  'https://web-sight.herokuapp.com', '', '', '',
  'https://to-do-list-ang.herokuapp.com/', '',
];

$('#nextProject svg').click(() => {
  if (currentProject < projectNames.length + 1) goToNextProject();
});
$('#previousProject svg').click(() => {
  if (currentProject > 1) goToPreviousProject();
});

function goToNextProject(){
  $('#nextProject svg, #previousProject svg').unbind('click');
  if (currentProject == projectNames.length) {
    $('#projectName').fadeOut(function () {
      $(this).text('You might find some more on my github account :)').fadeIn();
      $('#projectGithub').attr('href', 'https://github.com/akhil-rana/');
      $('#previousProject svg').click(() => {
        if (currentProject > 1) goToPreviousProject();
      });
      currentProject++;
    });
    $('#projectDeployment').fadeOut();
    $('#nextProject').fadeOut();
    $('#projectDescription').fadeOut(function(){
      $(this).text('').fadeIn();
    });
  } else {
    $('#previousProject').fadeIn();
    $('#projectName').fadeOut(function () {
      $(this).text(projectNames[currentProject]).fadeIn();
    });
    $('#projectDescription').fadeOut(function () {
      $(this).text(projectDescriptions[currentProject]).fadeIn();
      if (projectsDeployStatus[currentProject])
        $('#projectDeployment').fadeIn().attr('href', projectsDeployLinks[currentProject]);
      else
        $('#projectDeployment').fadeOut();
      $('#projectGithub').attr('href', projectsGithubLinks[currentProject]);
      currentProject++;
      $('#nextProject svg').click(() => {
        if (currentProject < projectNames.length + 1) goToNextProject();
      });
      $('#previousProject svg').click(() => {
        if (currentProject > 1) goToPreviousProject();
      });
    });
  }
}

function goToPreviousProject() {
  $('#previousProject svg, #nextProject svg').unbind('click');
  if (currentProject < 3) {
    $('#previousProject').fadeOut();
  }
  $('#projectName').fadeOut(function () {
    $(this).text(projectNames[currentProject - 2]).fadeIn();
  });
  $('#projectDescription').fadeOut(function () {
    if (projectsDeployStatus[currentProject - 2])
      $('#projectDeployment').fadeIn().attr('href', projectsDeployLinks[currentProject - 2]);
    else $('#projectDeployment').fadeOut();
    $('#projectGithub').attr('href', projectsGithubLinks[currentProject - 2]);
    $(this).text(projectDescriptions[currentProject - 2]).fadeIn(function () {
      currentProject--;
      $('#previousProject svg').click(() => {
        if (currentProject > 1) goToPreviousProject();
      });
      $('#nextProject svg').click(() => {
        if (currentProject < projectNames.length + 1) goToNextProject();
      });
    });
  });
  $('#nextProject').fadeIn();
}