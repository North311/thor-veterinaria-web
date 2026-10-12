(function () {
  var T = window.THOR, S = T.servicios, E = T.especialistas;
  var $ = function (s) { return document.querySelector(s); };
  var DAY = 86400000;

  /* ---------- Capa de datos (punto de cambio) ----------
     Hoy guarda las citas en el navegador (demo). Cuando exista la API
     ASP.NET Core, reemplaza el cuerpo de estas funciones por fetch('/api/...'). */
  var API = {
    citas: function () { try { return JSON.parse(localStorage.getItem("thor_citas") || "[]"); } catch (e) { return []; } },
    guardar: function (c) { try { var a = API.citas(); a.push(c); localStorage.setItem("thor_citas", JSON.stringify(a)); } catch (e) {} },
    libre: function (fecha, hora, esp) {
      var oc = API.citas().filter(function (c) { return c.fecha === fecha && c.hora === hora && c.estado !== "Cancelada"; })
        .map(function (c) { return c.especialista; });
      if (esp) return oc.indexOf(esp) < 0 ? esp : null;
      for (var i = 0; i < E.length; i++) if (oc.indexOf(E[i]) < 0) return E[i];
      return null;
    }
  };

  /* ---------- Servicios, precios y selects ---------- */
  $("#svc").innerHTML = S.map(function (s) { return '<div class="row"><div><strong>' + s[1] + '</strong><br><span class="mute">' + s[2] + '</span></div><span class="mute">' + s[4] + ' min</span></div>'; }).join("");
  $("#tbl").innerHTML = S.map(function (s) { return '<tr><td>' + s[1] + '</td><td class="mute">' + s[4] + ' min</td><td>S/ ' + s[3] + '</td></tr>'; }).join("");
  $("#sel").insertAdjacentHTML("beforeend", S.map(function (s) { return '<option value="' + s[1] + '">' + s[1] + ' — S/ ' + s[3] + '</option>'; }).join(""));
  $("#esp").insertAdjacentHTML("beforeend", E.map(function (n) { return '<option>' + n + '</option>'; }).join(""));

  /* ---------- Fecha y horas disponibles ---------- */
  var f = $("#f-cita"), pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var hoy = new Date(); hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  var hoyStr = hoy.toISOString().slice(0, 10);
  f.fecha.min = hoyStr;
  f.fecha.max = new Date(hoy.getTime() + 60 * DAY).toISOString().slice(0, 10);
  function horas() {
    var sel = f.hora, fecha = f.fecha.value, esp = f.especialista.value, prev = sel.value;
    sel.innerHTML = "";
    if (!fecha) { sel.innerHTML = '<option value="">Elige primero la fecha</option>'; return; }
    if (new Date(fecha + "T12:00").getDay() === 0) { sel.innerHTML = '<option value="">Cerrado los domingos (emergencias 24 h)</option>'; return; }
    sel.innerHTML = '<option value="">Elige una hora</option>';
    var ahora = new Date().getHours(), hay = false;
    for (var h = 9; h <= 19; h++) {
      var t = pad(h) + ":00", ok = API.libre(fecha, t, esp) && !(fecha === hoyStr && h <= ahora);
      if (ok) hay = true;
      sel.insertAdjacentHTML("beforeend", '<option' + (ok ? "" : " disabled") + '>' + t + (ok ? "" : " (no disponible)") + '</option>');
    }
    if (!hay) sel.options[0].textContent = "Sin horas libres ese día";
    if (prev) for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === prev && !sel.options[i].disabled) sel.value = prev;
  }
  f.fecha.addEventListener("change", horas);
  f.especialista.addEventListener("change", horas);

  /* ---------- Reserva ---------- */
  function codigo(fecha) {
    var a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", r = "";
    for (var i = 0; i < 4; i++) r += a[Math.floor(Math.random() * a.length)];
    return "THR-" + fecha.replace(/-/g, "").slice(2) + "-" + r;
  }
  function mostrar(o, partes, link) {
    o.textContent = "";
    partes.forEach(function (p) { var el = document.createElement(p.cod ? "span" : "div"); if (p.cod) el.className = "cod"; el.textContent = p.t; o.appendChild(el); });
    if (link) { var a = document.createElement("a"); a.href = link.href; a.target = "_blank"; a.rel = "noopener"; a.textContent = link.t; o.appendChild(a); }
  }
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (f.web.value) return;
    var o = f.querySelector(".out");
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var esp = API.libre(f.fecha.value, f.hora.value, f.especialista.value);
    if (!esp) { mostrar(o, [{ t: "Esa hora ya no está disponible. Elige otra hora o cambia de especialista." }]); horas(); return; }
    var c = { codigo: codigo(f.fecha.value), estado: "Pendiente", nombre: f.nombre.value.trim(), dni: f.dni.value, telefono: f.telefono.value, email: f.email.value,
      mascota: f.mascota.value.trim(), especie: f.especie.value, raza: f.raza.value, sexo: f.sexo.value, edad: f.edad.value, servicio: f.servicio.value,
      especialista: esp, fecha: f.fecha.value, hora: f.hora.value, motivo: f.motivo.value };
    API.guardar(c);
    var msg = "Hola Thor, reservé la cita " + c.codigo + " para " + c.mascota + " (" + c.servicio + ") el " + c.fecha + " a las " + c.hora + ".";
    mostrar(o, [{ t: "Listo, " + c.nombre.split(" ")[0] + ". Tu cita quedó pendiente de confirmación." }, { t: c.codigo, cod: 1 },
      { t: c.servicio + " con " + c.especialista + " · " + c.fecha + " a las " + c.hora + ". Guarda este código." }],
      { t: "Confirmar por WhatsApp", href: "https://wa.me/" + T.telefono + "?text=" + encodeURIComponent(msg) });
    o.scrollIntoView({ block: "nearest" });
    f.reset(); horas();
  });

  /* ---------- Contacto (demo hasta conectar el servidor) ---------- */
  $("#f-msg").addEventListener("submit", function (e) {
    e.preventDefault(); var m = e.target; if (m.web.value) return;
    mostrar(m.querySelector(".out"), [{ t: "Gracias, " + m.nombre.value.trim() + ". Tu mensaje está listo. (Demo: se enviará cuando conectemos el servidor.)" }]);
    m.reset();
  });

  /* ---------- Blog con detalle ---------- */
  $("#posts").innerHTML = T.posts.map(function (p, i) {
    return '<article><p class="mute">' + p.fecha + '</p><h3>' + p.titulo + '</h3><p class="mute">' + p.resumen + '</p><button type="button" data-i="' + i + '">Leer artículo</button></article>';
  }).join("");
  $("#posts").addEventListener("click", function (e) {
    var i = e.target.dataset && e.target.dataset.i; if (i === undefined) return;
    var p = T.posts[i]; $("#dt").textContent = p.titulo; $("#dd").textContent = p.fecha;
    $("#db").innerHTML = ""; p.cuerpo.forEach(function (t) { var el = document.createElement("p"); el.textContent = t; $("#db").appendChild(el); });
    $("#dlg").showModal();
  });
  $("#priv").addEventListener("click", function (e) { e.preventDefault(); $("#dpv").showModal(); });

  /* ---------- Antes y después ---------- */
  $("#ba input").addEventListener("input", function (e) { $("#ba").style.setProperty("--v", e.target.value + "%"); });

  /* ---------- Tema claro/oscuro ---------- */
  var root = document.documentElement;
  try { var t0 = localStorage.getItem("thor_tema"); if (t0) root.dataset.theme = t0; } catch (e) {}
  $("#tg").addEventListener("click", function () {
    var oscuro = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme:dark)").matches;
    root.dataset.theme = oscuro ? "light" : "dark";
    try { localStorage.setItem("thor_tema", root.dataset.theme); } catch (e) {}
  });

  /* ---------- Sección activa en el menú ---------- */
  if ("IntersectionObserver" in window) {
    var links = {}; document.querySelectorAll("nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting && links[x.target.id]) { Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); }); links[x.target.id].setAttribute("aria-current", "true"); } });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { io.observe(s); });
  }
})();
