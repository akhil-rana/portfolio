document.querySelectorAll('.sendButton').forEach((button) => {
  let getVar = (variable) =>
    getComputedStyle(button).getPropertyValue(variable);

  document.getElementById('sendMailForm').addEventListener('submit', (e) => {
    if (!button.classList.contains('active')) {
      button.classList.add('active');

      gsap.to(button, {
        keyframes: [          {
            '--left-wing-first-x': 50,
            '--left-wing-first-y': 100,
            '--right-wing-second-x': 50,
            '--right-wing-second-y': 100,
            duration: 0.3,
            onComplete() {
              gsap.set(button, {
                '--left-wing-first-y': 0,
                '--left-wing-second-x': 40,
                '--left-wing-second-y': 100,
                '--left-wing-third-x': 0,
                '--left-wing-third-y': 100,
                '--left-body-third-x': 40,
                '--right-wing-first-x': 50,
                '--right-wing-first-y': 0,
                '--right-wing-second-x': 60,
                '--right-wing-second-y': 100,
                '--right-wing-third-x': 100,
                '--right-wing-third-y': 100,
                '--right-body-third-x': 60,
              });
            },
          },          {
            '--left-wing-third-x': 20,
            '--left-wing-third-y': 90,
            '--left-wing-second-y': 90,
            '--left-body-third-y': 90,
            '--right-wing-third-x': 80,
            '--right-wing-third-y': 90,
            '--right-body-third-y': 90,
            '--right-wing-second-y': 90,
            duration: 0.3,
          },          {
            '--rotate': 50,
            '--left-wing-third-y': 95,
            '--left-wing-third-x': 27,
            '--right-body-third-x': 45,
            '--right-wing-second-x': 45,
            '--right-wing-third-x': 60,
            '--right-wing-third-y': 83,
            duration: 0.35,
          },{
            '--rotate': 55,
            '--plane-x': -8,
            '--plane-y': 24,
            duration: 0.2,
          },          {
            duration: 0.4,
            onStart() {
              // Use the CSS variable instead of direct scaling to avoid transform conflicts
              gsap.to(button, {
                '--plane-scale': 2,
                duration: 0.4,
                ease: "power2.out",
              });
            },
          },          {
            '--rotate': 40,
            '--plane-x': 45,
            '--plane-y': -180,
            '--plane-opacity': 0,
            duration: 0.3,
            onComplete() {
              setTimeout(() => {
                sendMail();
                const emailForms = document.querySelectorAll('.emailForm');
                const sendButton = document.querySelector('.sendButton');
                
                emailForms.forEach(form => {
                  form.style.transition = 'opacity 300ms ease';
                  form.style.opacity = '0';
                });
                
                setTimeout(() => {
                  emailForms.forEach(form => form.style.display = 'none');
                }, 300);
                
                sendButton.style.cursor = 'default';
              }, 1000);
            },
          },
        ],
      });

      gsap.to(button, {
        keyframes: [
          {
            '--text-opacity': 0,
            '--border-radius': 0,
            '--left-wing-background': getVar('--primary-darkest'),
            '--right-wing-background': getVar('--primary-darkest'),
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            duration: 0.1,
          },
          {
            '--left-wing-background': getVar('--primary'),
            '--right-wing-background': getVar('--primary'),
            duration: 0.1,
          },
          {
            '--left-body-background': '#ffffff',
            '--right-body-background': '#ffffff',
            '--left-wing-background': '#ffffff',
            '--right-wing-background': '#ffffff',
            duration: 0.4,
          },          {
            '--success-opacity': 1,
            '--success-scale': 1,
            duration: 0.25,
            delay: 1.6,
          },
        ],
      });
    }
  });
});
