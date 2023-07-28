"use strict";
const e = require("async");
const t = require("path");
const r = require("fire-fs");
const a = require("plist");
const n = require("fire-url");
const i = "db://internal/image/default_sprite_splash.png/default_sprite_splash";
const o = "db://internal/image/default_btn_normal.png/default_btn_normal";
const c = "db://internal/image/default_btn_pressed.png/default_btn_pressed";
const l = "db://internal/image/default_btn_disabled.png/default_btn_disabled";
const s = "db://internal/image/default_scrollbar_vertical.png/default_scrollbar_vertical";
const d = "db://internal/image/default_scrollbar.png/default_scrollbar";
const u = "_action";
const f = 30;
const p = ["cubic", "elastic", "bounce", "back"];
const v = ["In", "Out", "InOut"];

const m = {
  CCBFile: function (e, t, r) {
    R(_(M(e), "ccbFile", ""), r);
  },
  CCScrollView: function (t, r, a) {
    var n = new cc.Node();
    var i = M(t);
    P(n, i, r);
    var o = n.addComponent(cc.ScrollView);
    if (!o) {
      return a(n);
    }
    o.inertia = _(i, "bounces", true);
    var c = _(i, "direction", 2);
    o.vertical = 1 === c || 2 === c;
    o.horizontal = 0 === c || 2 === c;
    if (
      (_(i, "clipsToBounds", true))
    ) {
      var l = n.addComponent(cc.Mask);
      l.enabled = true;
    }
    var s = _(i, "container", "");
    var d = null;
    e.waterfall(
      [
        function (e) {
          R(s, function (t) {
            (d = t).setName("container");
            e();
          });
        },
        function (e) {
          n.addChild(d);
          o.content = d;
          if ((o.vertical)) {
            var t = L(
              cc.Scrollbar.Direction.VERTICAL,
              "vScrollBar",
              n.getContentSize()
            );
            n.addChild(t);
            o.verticalScrollBar = t.getComponent(cc.Scrollbar);
          }
          if (o.horizontal) {
            var r = L(
              cc.Scrollbar.Direction.HORIZONTAL,
              "hScrollBar",
              n.getContentSize()
            );
            n.addChild(r);
            o.horizontalScrollBar = r.getComponent(cc.Scrollbar);
          }
          e();
        },
      ],
      function () {
        a(d, n);
      }
    );
  },
};

const h = {
  CCSprite: function (e, t, r) {
    x(e, t, "displayFrame", cc.Sprite.SizeMode.RAW, r);
  },
  CCScale9Sprite: function (t, r, a) {
    e.waterfall(
      [
        function (e) {
          x(t, r, "spriteFrame", cc.Sprite.SizeMode.CUSTOM, e);
        },
        function (e) {
          var a = t.getComponent(cc.Sprite);
          if (!a) {
            e();
            return;
          }
          var n = t.getContentSize();
          var i = _(r, "preferedSize", [n.width, n.height, 0]);
          t.setContentSize(i[0], i[1]);
          if (a.spriteFrame) {
            a.type = cc.Sprite.Type.SLICED;
            var o = a.spriteFrame._uuid;
            (function (e, t, r) {
              Editor.assetdb.queryMetaInfoByUuid(t, function (a, n) {
                if (!n) {
                  return r();
                }
                var i = JSON.parse(n.json);
                i.trimThreshold = -1;
                i.borderTop = _(e, "insetTop", 0);
                i.borderBottom = _(e, "insetBottom", 0);
                i.borderLeft = _(e, "insetLeft", 0);
                i.borderRight = _(e, "insetRight", 0);
                var o = JSON.stringify(i);
                Editor.assetdb.saveMeta(t, o, function () {
                  r();
                });
              });
            })(r, o, e);
          } else {
            e();
          }
        },
      ],
      a
    );
  },
  CCLayerColor: function (e, t, r) {
    var a = e.addComponent(cc.Sprite);
    if (!a) {
      return r();
    }
    a.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    a.trim = false;
    a.spriteFrame = new cc.SpriteFrame();
    a.spriteFrame._uuid = Editor.assetdb.remote.urlToUuid(i);
    r();
  },
  CCLabelTTF: B,
  CCLabelBMFont: B,
  CCMenuItemImage: function (e, t, r) {
    var a = e.addComponent(cc.Button);
    var n = e.addComponent(cc.Sprite);
    if (!a) {
      return r();
    }
    n.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    n.trim = false;
    a.interactable = _(t, "isEnabled", true);
    a.transition = cc.Button.Transition.SPRITE;
    var i = _(t, "normalSpriteFrame", null);
    n.spriteFrame = k(i, o);
    a.normalSprite = k(i, o);
    a.hoverSprite = k(i, o);
    var s = _(t, "selectedSpriteFrame", null);
    a.pressedSprite = k(s, c);
    var d = _(t, "disabledSpriteFrame", null);
    a.disabledSprite = k(d, l);
    r();
  },
  CCControlButton: function (e, r, a) {
    var n = e.addComponent(cc.Button);
    var i = e.addComponent(cc.Sprite);
    if (!n) {
      return a();
    }
    var s = _(r, "preferedSize", [0, 0, 0]);
    e.setContentSize(s[0], s[1]);
    i.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    i.type = cc.Sprite.Type.SLICED;
    i.trim = false;
    n.interactable = _(r, "enabled", true);
    n.transition = cc.Button.Transition.SPRITE;
    var d = _(r, "backgroundSpriteFrame|1", null);
    i.spriteFrame = k(d, o);
    n.normalSprite = k(d, o);
    n.hoverSprite = k(d, o);
    var u = _(r, "backgroundSpriteFrame|2", null);
    n.pressedSprite = k(u, c);
    var f = _(r, "backgroundSpriteFrame|3", null);
    n.disabledSprite = k(f, l);
    var p = _(r, "title|1", "");
    if (p) {
      var v = new cc.Node("title");
      var m = _(r, "labelAnchorPoint", [0, 0]);
      v.setAnchorPoint(m[0], m[1]);
      e.addChild(v);

      D(
        v,
        cc.v2(e.getContentSize().width / 2, e.getContentSize().height / 2)
      );

      var h = v.addComponent(cc.Label);
      var S = _(r, "titleTTFSize|1", [-1, 0]);
      var g = _(r, "titleColor|1", [255, 255, 255]);
      var C = new cc.Color(g[0], g[1], g[2]);
      v.color = C;
      h.string = p;
      h.lineHeight = 0;

      if (S[0] >= 0) {
        h._fontSize = S[0];
      }

      var b = _(r, "titleTTF|1", "");

      if (b && ".ttf" === t.extname(b)) {
        O(h, b);
      }
    }
    a();
  },
  CCParticleSystemQuad: function (e, t, r) {
    var a = e.addComponent(cc.ParticleSystem);
    if (!a) {
      return r();
    }
    a.custom = true;

    a.emitterMode = _(
        t,
        "emitterMode",
        cc.ParticleSystem.EmitterMode.GRAVITY
      );

    a.emissionRate = _(t, "emissionRate", 10);
    a.duration = _(t, "duration", -1);
    a.totalParticles = _(t, "totalParticles", 250);
    var i = _(t, "life", [3, 0.25]);
    a.life = i[0];
    a.lifeVar = i[1];
    var o = _(t, "startSize", [0, 0]);
    a.startSize = o[0];
    a.startSizeVar = o[1];
    var c = _(t, "endSize", [0, 0]);
    a.endSize = c[0];
    a.endSizeVar = c[1];
    var l = _(t, "startSpin", [0, 0]);
    a.startSpin = l[0];
    a.startSpinVar = l[1];
    var s = _(t, "endSpin", [0, 0]);
    a.endSpin = s[0];
    a.endSpinVar = s[1];
    var d = _(t, "angle", [0, 0]);
    a.angle = d[0];
    a.angleVar = d[1];
    var u = _(t, "startColor", [
      [255, 255, 255, 255],
      [0, 0, 0, 0],
    ]);

    a.startColor = new cc.Color(
      V(u[0][0]),
      V(u[0][1]),
      V(u[0][2]),
      V(u[0][3])
    );

    a.startColorVar = new cc.Color(
        V(u[1][0]),
        V(u[1][1]),
        V(u[1][2]),
        V(u[1][3])
      );

    var f = _(t, "endColor", [
      [255, 255, 255, 255],
      [0, 0, 0, 0],
    ]);

    a.endColor = new cc.Color(
      V(f[0][0]),
      V(f[0][1]),
      V(f[0][2]),
      V(f[0][3])
    );

    a.endColorVar = new cc.Color(
        V(f[1][0]),
        V(f[1][1]),
        V(f[1][2]),
        V(f[1][3])
      );

    var p = _(t, "blendFunc", [770, 771]);
    a.srcBlendFactor = p[0];
    a.dstBlendFactor = p[1];
    var v = _(t, "posVar", [0, 0]);
    a.posVar = cc.v2(v[0], v[1]);
    if (
      (a.emitterMode === cc.ParticleSystem.EmitterMode.GRAVITY)
    ) {
      var m = _(t, "gravity", [0, 0]);
      a.gravity = cc.v2(m[0], m[1]);
      var h = _(t, "speed", [0, 0]);
      a.speed = h[0];
      a.speedVar = h[1];
      var S = _(t, "tangentialAccel", [0, 0]);
      a.tangentialAccel = S[0];
      a.tangentialAccelVar = S[1];
      var C = _(t, "radialAccel", [0, 0]);
      a.radialAccel = C[0];
      a.radialAccelVar = C[1];
    } else {
      var b = _(t, "startRadius", [0, 0]);
      a.startRadius = b[0];
      a.startRadiusVar = b[1];
      var y = _(t, "endRadius", [0, 0]);
      a.endRadius = y[0];
      a.endRadiusVar = y[1];
      var w = _(t, "rotatePerSecond", [0, 0]);
      a.rotatePerS = w[0];
      a.rotatePerSVar = w[1];
    }
    var z = _(t, "texture", null);
    var F = false;
    if (!z) {
      return r();
    }
    var E = n.join(g, z);
    var A = Editor.assetdb.remote.urlToUuid(E);
    if (!Editor.assetdb.remote.existsByUuid(A)) {
      return r();
    }
    Editor.assetdb.queryMetaInfoByUuid(A, function (e, t) {
      if (e) {
        Editor.warn(e);
        return r();
      }
      var i = JSON.parse(t.json);
      if ("raw" === i.type) {
        Editor.info(
          "The sprite component only supports the texture which imports as sprite type."
        );

        return r();
      }
      var o = n.basenameNoExt(t.assetPath);
      var c = i.subMetas[o].uuid;
      cc.assetManager.loadAny(c, function (e, t) {
        if (e) {
          Editor.warn(e);
          return r();
        }
        a.spriteFrame = t;
        F = true;
        a.enabled = F;
        r();
      });
    });
  },
};

const S = {
  position: function (e, t, r) {
    r.props.position = [];
    for (var a = 0, n = e.keyframes.length; a < n; a++) {
      var i = e.keyframes[a];
      var o = {};
      o.frame = i.time;
      var c = D(t, cc.v2(i.value[0], i.value[1]));
      o.value = [c.x, c.y];
      var l = T(i);

      if (l) {
        o.curve = l;
      }

      r.props.position.push(o);
    }
  },
  rotation: function (e, t, r) {
    r.props.rotation = [];
    for (var a = 0, n = e.keyframes.length; a < n; a++) {
      var i = e.keyframes[a];
      var o = { frame: i.time, value: i.value };
      var c = T(i);

      if (c) {
        o.curve = c;
      }

      r.props.rotation.push(o);
    }
  },
  scale: function (e, t, r) {
    r.props.scaleX = [];
    r.props.scaleY = [];
    for (var a = 0, n = e.keyframes.length; a < n; a++) {
      var i = e.keyframes[a];
      var o = { frame: i.time, value: i.value[0] };
      var c = { frame: i.time, value: i.value[1] };
      var l = T(i);

      if (l) {
        o.curve = l;
        c.curve = l;
      }

      r.props.scaleX.push(o);
      r.props.scaleY.push(c);
    }
  },
  visible: function (e, t, r) {
    r.props.active = [];
    for (var a = 0, n = e.keyframes.length; a < n; a++) {
      var i = e.keyframes[a];

      if (0 === a && i.time > 0) {
        r.props.active.push({ frame: 0, value: false });
      }

      var o = { frame: i.time, value: a % 2 == 0 };
      r.props.active.push(o);
    }
  },
  color: function (e, t, r) {
    r.props.color = [];
    for (var a = 0, n = e.keyframes.length; a < n; a++) {
      var i = e.keyframes[a];

      var o = {
        frame: i.time,
        value: new cc.Color(i.value[0], i.value[1], i.value[2]),
      };

      var c = T(i);

      if (c) {
        o.curve = c;
      }

      r.props.color.push(o);
    }
  },
  opacity: function (e, t, r) {
    r.props.opacity = [];
    for (var a = 0, n = e.keyframes.length; a < n; a++) {
      var i = e.keyframes[a];
      var o = { frame: i.time, value: i.value };
      var c = T(i);

      if (c) {
        o.curve = c;
      }

      r.props.opacity.push(o);
    }
  },
  displayFrame: function (e, t, r) {
    if (!t) {
      return;
    }
    if (t.getComponent(cc.Sprite)) {
      if (!r.comps["cc.Sprite"]) {
        r.comps["cc.Sprite"] = {};
      }

      for (var a = [], n = 0, i = e.keyframes.length; n < i; n++) {
        var o = e.keyframes[n];
        var c = [o.value[1], o.value[0]];
        var l = k(c, "");
        if (l) {
          var s = { frame: o.time, value: l };
          a.push(s);
        }
      }
      r.comps["cc.Sprite"].spriteFrame = a;
    }
  },
};

var g = "";
var C = "";
var b = "";
var y = [];
var w = {};
var z = [];
function F(i, o) {
  if (y.indexOf(i) >= 0) {
    return o();
  }
  Editor.log("Importing ccb file : ", i);
  if (!r.existsSync(i)) {
    Editor.warn("%s is not existed!", i);
    return o();
  }
  var c = t.basename(i, t.extname(i));
  var l = t.relative(b, t.dirname(i));
  var s = t.join(C, l, c + ".prefab");
  e.waterfall(
    [
      function (o) {
        (function (i, o, c) {
          var l = new cc.Node();
          var s = a.parse(r.readFileSync(i, "utf8"));
          e.waterfall(
            [
              function (t) {
                w = {};
                z = s.sequences;
                var r = s.currentResolution;
                var a = s.resolutions;
                var n = new cc.Size(0, 0);

                if (a && a[r]) {
                  n.width = a[r].width;
                  n.height = a[r].height;
                }

                (function t(r, a, n, i, o) {
                  var c = r;
                  e.waterfall(
                    [
                      function (e) {
                        if (r) {
                          e();
                        } else {
                          var t = a.baseClass;
                          var n = m[t];

                          if (n) {
                            n(a, i, function (t, a) {
                              r = t;
                              c = a || r;
                              e();
                            });
                          } else {
                            r = new cc.Node();
                            c = r;
                            e();
                          }
                        }
                      },
                      function (e) {
                        if (a.animatedProperties) {
                          if (n) {
                            if (!w.childrenData) {
                              w.childrenData = {};
                            }

                            w.childrenData[n] = a.animatedProperties;
                            w.childrenData[n].theNode = r;
                          } else {
                            w.selfData = a.animatedProperties;
                            w.selfData.theNode = r;
                          }
                        }

                        if (!n) {
                          r.setName(a.displayName);
                        }

                        (function (e, t, r, a) {
                          var n = t.baseClass;
                          var i = M(t);

                          if ("CCScrollView" !== n) {
                            P(e, i, r);
                          }

                          if (n && h[n]) {
                            h[n](e, i, a);
                          } else {
                            a();
                          }
                        })(r, a, i, e);
                      },
                      function (i) {
                        var o = a.children;
                        if (!o || 0 === o.length) {
                          i();
                          return;
                        }
                        var c = r.getContentSize();
                        var l = [];
                        var s = 0;

                        if (n) {
                          n += "/";
                        }

                        e.whilst(
                          function (e) {
                            e(null, s < o.length);
                          },
                          function (e) {
                            var a = (function (e, t) {
                              var r = e.displayName;
                              var a = r.replace("/", "_");
                              var n = 1;
                              for (; t.indexOf(a) >= 0; ) {
                                a = r + "_" + n;
                                n++;
                              }

                              if (r !== a) {
                                Editor.warn(
                                  'The name of node "%s" was renamed to "%s".',
                                  r,
                                  a
                                );
                              }

                              return a;
                            })(o[s], l);

                            var i = n + a;
                            t(null, o[s], i, c, function (t) {
                              t.setName(a);
                              l.push(a);
                              r.addChild(t);
                              t.setPosition(D(t));
                              s++;
                              e();
                            });
                          },
                          function () {
                            i();
                          }
                        );
                      },
                    ],
                    function () {
                      o(c);
                    }
                  );
                })(l, s.nodeGraph, "", n, function () {
                  t();
                });
              },
              function (a) {
                (function (a, i, o) {
                  if (!w.selfData && !w.childrenData) {
                    return o();
                  }
                  var c;
                  var l;
                  var s = [];
                  var d = -1;
                  for (c = 0, l = z.length; c < l; c++) {
                    var p = z[c];

                    s[c] = {
                      name: p.name,
                      duration: p.length,
                      sample: f,
                      loop: 0 === p.chainedSequenceId,
                    };

                    if (p.autoPlay) {
                      d = c;
                    }
                  }

                  if (w.selfData) {
                    E(w.selfData, "", s);
                  }

                  if (w.childrenData) {
                    for (var v in w.childrenData) if (w.childrenData.hasOwnProperty(v)) {
                      E(w.childrenData[v], v, s);
                    }
                  }
                  var m = (function (e) {
                    var r = t.dirname(e);
                    var a = t.relative(C, r);
                    var i = t.basename(e, t.extname(e)) + u;
                    n.join(g, a, i);
                    return t.join(C, a, i);
                  })(i);

                  if (!r.existsSync(m)) {
                    r.mkdirsSync(m);
                  }

                  var h = t.dirname(m);
                  var S = t.relative(C, h);
                  var b = n.join(g, S);
                  var y = [];
                  for (c = 0, l = s.length; c < l; c++) {
                    var F = s[c];
                    var A = F.name + ".anim";
                    var T = t.join(m, A);
                    var M = new cc.AnimationClip();
                    M.sample = F.sample;
                    M._name = F.name;
                    M._duration = F.duration;
                    M.curveData = F.curveData;

                    M.wrapMode = F.loop
                        ? cc.WrapMode.Loop
                        : cc.WrapMode.Normal;

                    var _ = Editor.serialize(M);
                    r.writeFileSync(T, _);
                    y.push(n.join(b, t.basename(m), A));
                  }
                  e.waterfall(
                    [
                      function (e) {
                        Editor.assetdb.import([m], b, false, function () {
                          e();
                        });
                      },
                      function (e) {
                        var t = a.addComponent(cc.Animation);
                        if (t) {
                          for (c = 0, l = y.length; c < l; c++) {
                            var r = y[c];
                            var i = Editor.assetdb.remote.urlToUuid(r);
                            if (i) {
                              var o = new cc.AnimationClip();
                              o._uuid = i;
                              o._name = n.basenameNoExt(r);
                              t.addClip(o);

                              if (d === c) {
                                t.defaultClip = o;
                                t.playOnLoad = true;
                              }
                            }
                          }
                          e();
                        } else {
                          Editor.warn("Add Animation component failed.");
                          e();
                        }
                      },
                    ],
                    o
                  );
                })(l, o, a);
              },
              function (e) {
                let a = Editor.require("scene://utils/prefab");
                var n = a.createPrefabFrom(l);
                var i = Editor.serialize(n);
                var c = t.dirname(o);

                if (!r.existsSync(c)) {
                  r.mkdirsSync(c);
                }

                r.writeFileSync(o, i);
                e();
              },
            ],
            c
          );
        })(i, s, o);
      },
      function (e) {
        if (!r.existsSync(s)) {
          return e();
        }
        var t = n.join(g, l);
        Editor.assetdb.import([s], t, false, function () {
          y.push(i);
          e();
        });
      },
    ],
    o
  );
}
function E(e, t, r) {
  for (var a = e.theNode, n = 0, i = r.length; n < i; n++) {
    var o = e["" + n];

    if (o) {
      if (!r[n].curveData) {
        r[n].curveData = {};
      }

      if (t) {
        if (!r[n].curveData.paths) {
          r[n].curveData.paths = {};
        }

        if (!r[n].curveData.paths[t]) {
          r[n].curveData.paths[t] = {};
        }

        A(o, a, r[n].curveData.paths[t]);
      } else {
        A(o, a, r[n].curveData);
      }
    }
  }
}
function A(e, t, r) {
  for (var a in (r.props || (r.props = {}), r.comps || (r.comps = {}), e))
    if (e.hasOwnProperty(a)) {
      var n = S[a];

      if (n) {
        n(e[a], t, r);
      } else {
        Editor.log('Action for property "%s" is not supported.', a);
      }
    }
}
function T(e) {
  if (!e.easing) {
    return null;
  }
  var t = e.easing.type;
  if (t < 0 || t > 13) {
    return null;
  }
  var r = null;
  if (0 === t) {
    r = "constant";
  } else {
    if (1 === t) {
      r = "linear";
    } else {
      var a = t - 2;
      var n = Math.floor((a - 1) / 3);
      var i = (a - 1) % 3;
      r = p[n] + v[i];
    }
  }
  return r;
}
function M(e) {
  for (var t = e.properties, r = {}, a = 0, n = t.length; a < n; a++) {
    var i = t[a];
    r[i.name] = { type: i.type, value: i.value };
  }
  return r;
}
function _(e, t, r) {
  return e[t] ? e[t].value : r;
}
function D(e, t) {
  if (!t) {
    t = e.getPosition();
  }

  var r = e.getParent();
  if (!r) {
    return t;
  }
  var a = r.getAnchorPoint();
  var n = r.getContentSize();
  var i = t.x - n.width * a.x;
  var o = t.y - n.height * a.y;
  return cc.v2(i, o);
}
function P(e, t, r) {
  e.active = _(t, "visible", true);
  var a = _(t, "anchorPoint", [0, 0]);

  if (_(t, "ignoreAnchorPointForPosition", false)) {
    e.setAnchorPoint(0, 0);
  } else {
    e.setAnchorPoint(a[0], a[1]);
  }

  (function (e, t, r) {
    var a = _(t, "position", [0, 0, 0]);
    var n = null;

    var i = (n = t.preferedSize
      ? _(t, "preferedSize")
      : t.dimensions
      ? _(t, "dimensions")
      : _(t, "contentSize", [0, 0, 0]))[2];

    var o = n[0];
    var c = n[1];
    switch (i) {
      case 1:
        o = (r.width * o) / 100;
        c = (r.height * c) / 100;
        break;
      case 2:
        o = r.width - o;
        c = r.height - c;
        break;
      case 3:
        o = (r.width * o) / 100;
        break;
      case 4:
        c = (r.height * c) / 100;
    }
    e.setContentSize(o, c);
    var l = a[2];
    var s = a[0];
    var d = a[1];
    switch (l) {
      case 1:
        d = r.height - d;
        break;
      case 2:
        s = r.width - s;
        d = r.height - d;
        break;
      case 3:
        s = r.width - s;
        break;
      case 4:
        s = (r.width * s) / 100;
        d = (r.height * d) / 100;
    }
    e.setPosition(s, d);
  })(e, t, r);

  e.angle = _(t, "rotation", 0);
  var n = _(t, "flip", [false, false]);
  var i = _(t, "scale", [1, 1, false, 0]);
  var o = n[0] ? -1 * i[0] : i[0];
  var c = n[1] ? -1 * i[1] : i[1];
  e.setScale(o, c);
  var l = _(t, "color", [255, 255, 255]);
  e.color = new cc.Color(l[0], l[1], l[2]);
  var s = _(t, "opacity", 255);
  e.opacity = s;
}
function N(e, t) {
  var r = "";
  if (!e || e.length < 2 || (!e[0] && !e[1])) {
    r = t;
  } else {
    if (e[0]) {
      var a = n.join(g, e[0]);
      r = n.join(a, e[1]);
    } else {
      r = n.join(g, e[1]);
      r = n.join(r, n.basenameNoExt(r));
    }
  }
  if (!r) {
    return null;
  }
  var i = Editor.assetdb.remote.urlToUuid(r);
  return Editor.assetdb.remote.existsByUuid(i) ? i : null;
}
function k(e, t) {
  let r = N(e, t);
  if (!r) {
    Editor.warn(
      "Failed to import spriteframe asset, asset info: " +
        e +
        ", defaultUrl: " +
        t
    );

    return null;
  }
  var a = new cc.SpriteFrame();
  a._uuid = r;
  return a;
}
function x(e, t, r, a, n) {
  var i = e.addComponent(cc.Sprite);
  if (!i) {
    return n();
  }
  var o = _(t, "blendFunc", [770, 771]);
  i.srcBlendFactor = 1 === o[0] ? 770 : o[0];
  i.dstBlendFactor = o[1];
  var c = _(t, r, null);
  i.sizeMode = a;
  i.trim = false;
  let l = N(c, "");
  cc.assetManager.loadAny(l, function (e, t) {
    i.spriteFrame = t;
    n();
  });
}
function B(r, a, n) {
  var i = r.addComponent(cc.Label);
  if (!i) {
    return n();
  }
  var o = _(a, "dimensions", [0, 0, 0]);

  if (0 === o[0] || 0 === o[1]) {
    i.overflow = cc.Label.Overflow.NONE;
  } else {
    i.overflow = cc.Label.Overflow.CLAMP;
    i._useOriginalSize = false;
    r.setContentSize(o[0], o[1]);
  }

  i.string = _(a, "string", "");
  i.lineHeight = 0;
  i.horizontalAlign = _(a, "horizontalAlignment", 0);
  i.verticalAlign = _(a, "verticalAlignment", 0);
  var c = _(a, "fontName", "");
  var l = _(a, "fntFile", "");
  e.waterfall(
    [
      function (e) {
        if (l) {
          O(i, l, e);
        } else {
          if (c && ".ttf" === t.extname(c)) {
            O(i, c, e);
          } else {
            e();
          }
        }
      },
      function (e) {
        var r = _(a, "fontSize", [-1, 0]);

        if (r[0] >= 0) {
          i._fontSize = r[0];
          e();
        } else {
          if (l) {
            cc.assetManager.loadAny(
                  { url: t.join(C, l) },
                  null,
                  function (t, r) {
                    if (t) {
                      return e();
                    }
                    i._fontSize = r.fontSize;
                    i.lineHeight = r.commonHeight;
                    e();
                  }
                );
          } else {
            e();
          }
        }
      },
    ],
    n
  );
}
function O(e, t, r) {
  if (!e || !t) {
    return r();
  }
  var a = n.join(g, t);
  var i = false;
  if (a) {
    var o = Editor.assetdb.remote.urlToUuid(a);

    if (Editor.assetdb.remote.existsByUuid(o)) {
      i = true;
    }
  }

  if (i) {
    cc.assetManager.loadAny(o, function (t, a) {
      if (t) {
        return r();
      }
      e.font = a;
      r();
    });
  } else {
    r();
  }
}
function V(e) {
  return e > 1 ? e : Math.round(255 * e);
}
function R(a, i) {
  var o = t.join(b, a);
  var c = null;
  var l = false;

  if (a && r.existsSync(o)) {
    l = true;
  }

  e.waterfall(
    [
      function (e) {
        if (!l) {
          return e();
        }
        F(o, e);
      },
      function (e) {
        if (!l) {
          return e();
        }
        var r = t.dirname(o);
        var a = t.relative(b, r);
        var i = t.basename(o, t.extname(o));
        var s = n.join(g, a, i + ".prefab");
        var d = Editor.assetdb.remote.urlToUuid(s);
        cc.assetManager.loadAny(d, function (t, r) {
          if (t) {
            e();
          } else {
            c = cc.instantiate(r);
            e();
          }
        });
      },
    ],
    function () {
      if (!c) {
        c = new cc.Node();
      }

      i(c);
    }
  );
}
function L(e, t, r) {
  var a = new cc.Node(t);
  var n = a.addComponent(cc.Scrollbar);
  n.direction = e;
  var i = a.addComponent(cc.StudioWidget);
  i.isAlignRight = true;
  i.isAlignBottom = true;
  i.isAlignTop = e === cc.Scrollbar.Direction.VERTICAL;
  i.isAlignLeft = e === cc.Scrollbar.Direction.HORIZONTAL;
  var o = new cc.Node("bar");
  a.addChild(o);
  var c = o.addComponent(cc.Sprite);
  c.type = cc.Sprite.Type.SLICED;
  c.trim = false;
  c.sizeMode = cc.Sprite.SizeMode.CUSTOM;
  c.spriteFrame = new cc.SpriteFrame();

  if (e === cc.Scrollbar.Direction.HORIZONTAL) {
    a.setContentSize(r.width, 15);
    o.setContentSize(0.7 * r.width, 15);
    c.spriteFrame._uuid = Editor.assetdb.remote.urlToUuid(d);
  } else {
    a.setContentSize(15, r.height);
    o.setContentSize(15, 0.7 * r.height);
    c.spriteFrame._uuid = Editor.assetdb.remote.urlToUuid(s);
  }

  n.handle = c;
  return a;
}

module.exports = {
  importCCBFiles: function (t, r, a, n, i) {
    C = r;
    b = a;
    g = n;
    var o = 0;
    e.whilst(
      function (e) {
        e(null, o < t.length);
      },
      function (e) {
        F(t[o], function () {
          o++;
          e();
        });
      },
      function () {
        i();
      }
    );
  },
};
