const n = [
  [
    { time: 0, value: 1, outTangent: 0, inTangent: 0 },
    { time: 1, value: 1, outTangent: 0, inTangent: 0 },
  ],
  [
    { time: 0, value: 0, outTangent: 1, inTangent: 1 },
    { time: 1, value: 1, outTangent: 1, inTangent: 1 },
  ],
  [
    { time: 0, value: 1, outTangent: -1, inTangent: -1 },
    { time: 1, value: 0, outTangent: -1, inTangent: -1 },
  ],
  [
    { time: 0, value: 0, outTangent: 0, inTangent: 0 },
    { time: 1, value: 1, outTangent: 2, inTangent: 2 },
  ],
  [
    { time: 0, value: 1, outTangent: -2, inTangent: -2 },
    { time: 1, value: 0, outTangent: 0, inTangent: 0 },
  ],
  [
    { time: 0, value: 0, outTangent: 2, inTangent: 2 },
    { time: 1, value: 1, outTangent: 0, inTangent: 0 },
  ],
  [
    { time: 0, value: 1, outTangent: 0, inTangent: 0 },
    { time: 1, value: 0, outTangent: 0, inTangent: 0 },
  ],
];
function t(n, t, e, a) {
  const i = n.x;
  const o = n.y;
  const u = e.x;
  const T = e.y;
  let g;
  let l;
  let c;
  let r;
  let s;
  let m;
  let v;
  let h;
  const f = [
    1,
    i,
    i * i,
    i * i * i,
    1,
    u,
    u * u,
    u * u * u,
    0,
    1,
    2 * i,
    3 * i * i,
    0,
    1,
    2 * u,
    3 * u * u,
  ];
  for (h = (n) =>
         n[0] * n[4] * n[8] +
         n[1] * n[5] * n[6] +
         n[2] * n[3] * n[7] -
         n[2] * n[4] * n[6] -
         n[1] * n[3] * n[8] -
         n[0] * n[5] * n[7],
         g = v = 0;
       g < 4;
       v += h(m) * f[g] * (g % 2 ? -1 : 1), g++)
  {
    if (f[g]) {
      for (l = 4, m = []; l < f.length; l++) {
        if (l % 4 !== g) {
          m.push(f[l]);
        }
      }
    }
  }
  for (s = [], g = 0; g < 4; g++) {
    for (l = 0; l < 4; s[g + 4 * l] = (((g + l) % 2 ? -1 : 1) * h(m)) / v, l++) {
      for (m = [], c = 0; c < 3; c++) {
        for (r = 0; r < 3; r++) {
          m.push(f[((g + c + 1) % 4) * 4 + ((l + r + 1) % 4)]);
        }
      }
    }
  }
  const p = o * s[0] + T * s[1] + t * s[2] + a * s[3];
  const y = o * s[4] + T * s[5] + t * s[6] + a * s[7];
  const x = o * s[8] + T * s[9] + t * s[10] + a * s[11];
  return { a: o * s[12] + T * s[13] + t * s[14] + a * s[15], b: x, c: y, d: p };
}
function e(n) {
  const { a: t, b: e, c: a, d: i } = n;
  return (n) => t * n * n * n + e * n * n + a * n + i;
}
module.exports = {
  Point: class {
    constructor(n) {
      this.x = Number(n.x);
      this.y = Number(n.y);

      if (n.type) {
        this.type = n.type;
      }

      this.canvas = null;
    }
  },
  drawLine: function (n, t, e) {
    e.beginPath();
    e.moveTo(n.x, n.y);
    e.lineTo(t.x, t.y);
    e.closePath();
    e.stroke();
  },
  calcHermite: t,
  drawHermite: function (a, i, o) {
    if (!a) {
      a = n[0];
    }

    const u = i.canvas.width;
    const T = i.canvas.height;
    let g;
    i.clearRect(0, 0, u, T);
    g = o ? T / u / 2 : T / u;
    const l = a.map((n) => ({
      point: { x: n.time * u, y: n.value * T },
      outTangent: n.outTangent * g,
      inTangent: n.inTangent * g,
    }));
    for (let n = 0; n < l.length - 1; n++) {
      const a = l[n + 1];
      const u = l[n];
      const g = e(t(u.point, u.outTangent, a.point, a.inTangent));
      i.beginPath();
      for (let n = u.point.x; n <= a.point.x; n++) {
        if (o) {
          i.lineTo(n, T - 0.5 * g(n) - T / 2);
        } else {
          i.lineTo(n, T - g(n));
        }
      }
      i.stroke();
    }

    if (o) {
      i.strokeStyle = "#ccc";
      i.lineWidth = 0.5;
      i.beginPath();
      i.moveTo(0, T / 2);
      i.lineTo(u, T / 2);
      i.stroke();
    }
  },
  calcFunc: e,
  DEFAULT_KEYFRAMES: n,
};
