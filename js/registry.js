// Content registry: the data files in js/data/ call CS116.unit(...) and CS116.mockExam(...).
window.CS116 = {
  units: [],
  mock: [],
  unit(u) { this.units.push(u); },
  mockExam(m) { this.mock = m; },
};
