let e = cc.gfx;
let t = cc.renderer.Pass;
t.prototype._doSetBlend = t.prototype.setBlend;

t.prototype.setBlend = function (t, o, _, d, N, B, D, n) {
  if (!(
    (void 0 !== o && o !== e.BLEND_FUNC_ADD) ||
    (void 0 !== N && N !== e.BLEND_FUNC_ADD)
  )) {
    B = e.BLEND_ONE;
    D = e.BLEND_ONE_MINUS_SRC_ALPHA;
  }

  this._doSetBlend(t, o, _, d, N, B, D, n);
};
