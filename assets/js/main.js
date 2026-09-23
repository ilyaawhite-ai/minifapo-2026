/* ==========================================================================
   MINIFAPO 2026 · Scripts du site
   Menu mobile, compte à rebours, filtres, onglets du programme, formulaire.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------------
     En-tête : ombre au défilement
     ------------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Menu mobile
     ------------------------------------------------------------------------ */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu-mobile');

  if (toggle && menu) {
    var label = toggle.querySelector('[data-menu-label]');

    var openMenu = function () {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      if (label) label.textContent = 'Fermer le menu';
      root.classList.add('menu-open');
      requestAnimationFrame(function () {
        menu.classList.add('is-open');
      });
    };

    var closeMenu = function (returnFocus) {
      if (menu.hidden) return;
      toggle.setAttribute('aria-expanded', 'false');
      if (label) label.textContent = 'Ouvrir le menu';
      root.classList.remove('menu-open');
      menu.classList.remove('is-open');
      var done = function () { menu.hidden = true; };
      if (reduceMotion.matches) done();
      else setTimeout(done, 300);
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') closeMenu(false);
      else openMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu(false);
    });

    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (mq) {
      if (mq.matches) closeMenu(false);
    });
  }

  /* ------------------------------------------------------------------------
     Compte à rebours jusqu'à l'ouverture du festival
     Les dates se règlent dans les attributs data-start et data-end du HTML.
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-countdown]').forEach(function (el) {
    var start = Date.parse(el.dataset.start);
    var end = Date.parse(el.dataset.end || '') || start;
    if (isNaN(start)) return;

    var units = {};
    ['days', 'hours', 'minutes', 'seconds'].forEach(function (key) {
      units[key] = {
        value: el.querySelector('[data-unit="' + key + '"]'),
        name: el.querySelector('[data-unit-name="' + key + '"]'),
        last: null
      };
    });
    var grid = el.querySelector('.countdown__grid');
    var labelEl = el.querySelector('[data-countdown-label]');
    var localEl = el.querySelector('[data-countdown-local]');

    var names = {
      days: ['Jour', 'Jours'],
      hours: ['Heure', 'Heures'],
      minutes: ['Minute', 'Minutes'],
      seconds: ['Seconde', 'Secondes']
    };

    // Heure d'ouverture dans le fuseau du visiteur, s'il n'est pas à Wallis
    if (localEl) {
      var startDate = new Date(start);
      if (startDate.getTimezoneOffset() !== -720) {
        var day = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(startDate);
        var time = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(startDate).replace(':', ' h ');
        localEl.textContent = 'Soit le ' + day + ' à ' + time + ' à votre heure locale.';
      }
    }

    var pad = function (n) { return n < 10 ? '0' + n : String(n); };

    var showMessage = function (html, labelText) {
      if (grid) grid.hidden = true;
      if (labelEl) labelEl.textContent = labelText;
      var message = el.querySelector('.countdown__message');
      if (!message) {
        message = document.createElement('p');
        message.className = 'countdown__message';
        el.insertBefore(message, grid ? grid.nextSibling : null);
      }
      message.innerHTML = html;
    };

    var timer;

    var render = function () {
      var now = Date.now();
      var diff = start - now;

      if (diff <= 0) {
        clearTimeout(timer);
        if (now <= end) {
          el.dataset.state = 'live';
          showMessage('Le festival a commencé. <a href="programme.html">Voir le programme du jour</a>', 'C’est parti');
        } else {
          el.dataset.state = 'over';
          showMessage('Merci d’avoir fait vivre MINIFAPO 2026. Mālō&nbsp;!', 'Festival terminé');
        }
        return false;
      }

      var total = Math.floor(diff / 1000);
      var values = {
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60
      };

      Object.keys(values).forEach(function (key) {
        var unit = units[key];
        var v = values[key];
        if (!unit.value || unit.last === v) return;
        unit.value.textContent = key === 'days' ? String(v) : pad(v);
        if (unit.name) unit.name.textContent = names[key][v > 1 ? 1 : 0];
        if (unit.last !== null && !reduceMotion.matches) {
          unit.value.classList.remove('is-tick');
          void unit.value.offsetWidth; // relance l'animation
          unit.value.classList.add('is-tick');
        }
        unit.last = v;
      });
      return true;
    };

    var loop = function () {
      if (!render()) return;
      // Recalage sur la seconde suivante pour un défilement régulier
      timer = setTimeout(loop, 1000 - (Date.now() % 1000) + 10);
    };
    loop();
  });

  /* ------------------------------------------------------------------------
     Filtres (page Participants)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var list = document.querySelector(group.dataset.filterGroup);
    if (!list) return;
    var buttons = Array.prototype.slice.call(group.querySelectorAll('[data-filter]'));
    var items = Array.prototype.slice.call(list.querySelectorAll('[data-tags]'));
    var count = group.querySelector('[data-filter-count]');
    var empty = document.querySelector('[data-filter-empty]');
    group.hidden = false;

    var apply = function (value) {
      var visible = 0;
      items.forEach(function (item) {
        var tags = item.dataset.tags.split(' ');
        var show = value === 'tous' || tags.indexOf(value) !== -1;
        item.hidden = !show;
        if (show) visible++;
      });
      if (count) count.textContent = visible + (visible > 1 ? ' participants' : ' participant');
      if (empty) empty.hidden = visible !== 0;
    };

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
        var run = function () { apply(button.dataset.filter); };
        if (document.startViewTransition && !reduceMotion.matches) document.startViewTransition(run);
        else run();
      });
    });

    // Chaque carte glisse vers sa nouvelle place lors du filtrage
    items.forEach(function (item, i) { item.style.viewTransitionName = 'participant-' + i; });
  });

  /* ------------------------------------------------------------------------
     Onglets (page Programme)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-tabs]').forEach(function (container) {
    var tablist = container.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(container.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute('aria-controls')); });
    if (!tablist || !tabs.length) return;
    tablist.hidden = false;

    var select = function (index, options) {
      options = options || {};
      tabs.forEach(function (tab, i) {
        var active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
      });
      if (options.animate && !reduceMotion.matches) {
        var panel = panels[index];
        panel.classList.remove('is-entering');
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }
      if (options.focus) tabs[index].focus();
      if (options.scroll && tablist.scrollWidth > tablist.clientWidth) {
        tablist.scrollTo({ left: tabs[index].offsetLeft - tablist.offsetLeft - 16, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      }
      if (options.updateHash && history.replaceState) history.replaceState(null, '', '#' + panels[index].id);
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        select(i, { animate: true, updateHash: true, scroll: true });
      });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        event.preventDefault();
        select(next, { focus: true, animate: true, updateHash: true, scroll: true });
      });
    });

    // Jour affiché au chargement : l'ancre (#jour-3), sinon le jour même pendant le festival
    var initial = 0;
    var fromHash = panels.findIndex(function (p) { return '#' + p.id === window.location.hash; });
    if (fromHash !== -1) {
      initial = fromHash;
    } else {
      var today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Wallis' }).format(new Date());
      var todayIndex = panels.findIndex(function (p) { return p.dataset.date === today; });
      if (todayIndex !== -1) initial = todayIndex;
    }
    select(initial, { scroll: fromHash !== -1 });

    window.addEventListener('hashchange', function () {
      var i = panels.findIndex(function (p) { return '#' + p.id === window.location.hash; });
      if (i !== -1) select(i, { animate: true });
    });
  });

  /* ------------------------------------------------------------------------
     Sommaire actif selon la section visible (Activités, Infos pratiques)
     ------------------------------------------------------------------------ */
  if ('IntersectionObserver' in window) {
    document.querySelectorAll('[data-scrollspy]').forEach(function (nav) {
      var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
      var sections = links
        .map(function (link) { return document.getElementById(link.getAttribute('href').slice(1)); })
        .filter(Boolean);
      if (!sections.length) return;

      var setActive = function (id) {
        links.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + id;
          link.classList.toggle('is-active', active);
          if (active) {
            link.setAttribute('aria-current', 'true');
            var list = link.closest('ul');
            if (list && list.scrollWidth > list.clientWidth) {
              list.scrollTo({ left: link.offsetLeft - 24, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
            }
          } else {
            link.removeAttribute('aria-current');
          }
        });
      };

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: '-35% 0px -60% 0px' });

      sections.forEach(function (section) { observer.observe(section); });
    });
  }

  /* ------------------------------------------------------------------------
     Formulaire de contact
     - data-endpoint vide : ouverture de la messagerie avec le message pré-rempli
     - data-endpoint renseigné (Formspree, Getform…) : envoi direct
     ------------------------------------------------------------------------ */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var status = form.querySelector('[data-form-status]');
    var subject = form.querySelector('#objet');
    var submit = form.querySelector('[type="submit"]');

    var setStatus = function (text, type) {
      status.textContent = text;
      status.className = 'form-status' + (type ? ' is-' + type : '');
    };

    // Préselection de l'objet via l'ancre (#partenariat, #benevolat…)
    var presetSubject = function (value) {
      if (!subject || !value) return false;
      var option = subject.querySelector('option[value="' + value + '"]');
      if (!option) return false;
      subject.value = value;
      return true;
    };
    if (presetSubject(window.location.hash.slice(1))) {
      window.addEventListener('load', function () {
        form.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
    }

    document.querySelectorAll('[data-subject]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        presetSubject(link.dataset.subject);
        form.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
        setTimeout(function () { form.querySelector('#nom').focus({ preventScroll: true }); }, 400);
      });
    });

    // Lien entre chaque champ et son message d'erreur
    form.querySelectorAll('.field__error').forEach(function (error) {
      var field = error.parentElement.querySelector('input, textarea, select');
      if (field) field.setAttribute('aria-describedby', error.id);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      form.classList.add('was-validated');

      if (!form.checkValidity()) {
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        setStatus('Vérifiez les champs signalés en rouge.', 'error');
        return;
      }

      var data = new FormData(form);
      if (data.get('site_web')) return; // piège à robots

      var endpoint = form.dataset.endpoint;
      var subjectLabel = subject.options[subject.selectedIndex].text;

      if (endpoint) {
        submit.setAttribute('aria-busy', 'true');
        setStatus('Envoi en cours…');
        data.delete('site_web');
        data.append('_subject', 'MINIFAPO 2026 · ' + subjectLabel);
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            form.reset();
            form.classList.remove('was-validated');
            setStatus('Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.', 'success');
          })
          .catch(function () {
            setStatus('L’envoi a échoué. Réessayez ou écrivez-nous à ' + form.dataset.email + '.', 'error');
          })
          .then(function () { submit.removeAttribute('aria-busy'); });
        return;
      }

      var body = [
        'Nom : ' + data.get('nom'),
        'E-mail : ' + data.get('email'),
        data.get('telephone') ? 'Téléphone : ' + data.get('telephone') : '',
        '',
        data.get('message')
      ].filter(function (line, i) { return line !== '' || i === 3; }).join('\n');

      window.location.href = 'mailto:' + form.dataset.email +
        '?subject=' + encodeURIComponent('MINIFAPO 2026 · ' + subjectLabel) +
        '&body=' + encodeURIComponent(body);
      setStatus('Votre messagerie va s’ouvrir avec votre message. Si rien ne se passe, écrivez-nous à ' + form.dataset.email + '.', 'success');
    });
  }

  /* ------------------------------------------------------------------------
     Année du pied de page
     ------------------------------------------------------------------------ */
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) {
    if (Number(year) > 2026) el.textContent = '2026 – ' + year;
  });
})();
