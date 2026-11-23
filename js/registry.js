// Content registry: the data files in js/data/ call CS116.unit(...), CS116.mockExam(...) and CS116.explain(...).
window.CS116 = {
  units: [],
  mock: [],
  ex: {},
  unit(u) { this.units.push(u); },
  mockExam(m) { this.mock = m; },
  explain(map) { Object.assign(this.ex, map); },
};
