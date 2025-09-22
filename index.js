"use strict";

function loadNamesDataset() {
  try {
    return require("./names.json");
  } catch (_err) {
    try {
      const fs = require("fs");
      const path = require("path");
      const localPath = path.resolve(__dirname || ".", "names.json");
      const raw = fs.readFileSync(localPath, "utf8");
      return JSON.parse(raw);
    } catch (_err2) {
      return [];
    }
  }
}

function buildIndexes(records) {
  const lowerToCanonical = Object.create(null);
  const sexByName = Object.create(null);
  const vocativeByName = Object.create(null);
  for (const rec of records) {
    if (!rec || !rec.name) continue;
    const canonical = rec.name;
    const lower = canonical.toLowerCase();
    if (lowerToCanonical[lower] === undefined) {
      lowerToCanonical[lower] = canonical;
    }
    if (rec.sex) sexByName[canonical] = rec.sex;
    if (rec.vocative) vocativeByName[canonical] = rec.vocative;
  }
  return { lowerToCanonical, sexByName, vocativeByName };
}

function toCyrillic(input) {
  if (!input) return input;
  let s = String(input);
  // Handle Serbian digraph letters first
  s = s.replace(/DŽ|Dž|dž/g, (m) => (m === "dž" ? "џ" : "Џ"));
  s = s.replace(/LJ|Lj|lj/g, (m) => (m === "lj" ? "љ" : "Љ"));
  s = s.replace(/NJ|Nj|nj/g, (m) => (m === "nj" ? "њ" : "Њ"));

  const map = {
    A: "А", a: "а",
    B: "Б", b: "б",
    V: "В", v: "в",
    G: "Г", g: "г",
    D: "Д", d: "д",
    Đ: "Ђ", đ: "ђ",
    E: "Е", e: "е",
    Ž: "Ж", ž: "ж",
    Z: "З", z: "з",
    I: "И", i: "и",
    J: "Ј", j: "ј",
    K: "К", k: "к",
    L: "Л", l: "л",
    M: "М", m: "м",
    N: "Н", n: "н",
    O: "О", o: "о",
    P: "П", p: "п",
    R: "Р", r: "р",
    S: "С", s: "с",
    T: "Т", t: "т",
    Ć: "Ћ", ć: "ћ",
    U: "У", u: "у",
    F: "Ф", f: "ф",
    H: "Х", h: "х",
    C: "Ц", c: "ц",
    Č: "Ч", č: "ч",
    Š: "Ш", š: "ш",
    Q: "Q", q: "q",
    W: "W", w: "w",
    X: "X", x: "x",
    Y: "Y", y: "y"
  };
  let out = "";
  for (const ch of s) {
    out += map[ch] !== undefined ? map[ch] : ch;
  }
  return out;
}

const DATA = loadNamesDataset();
const INDEXES = buildIndexes(DATA);

function dekl(name) {
  const input = (name == null ? "" : String(name)).trim();
  if (!input) {
    return { name: "", sex: undefined, vocative: undefined, vocativeCyr: undefined, found: false };
  }
  const canonical = INDEXES.lowerToCanonical[input.toLowerCase()];
  if (!canonical) {
    return { name: input, sex: undefined, vocative: undefined, vocativeCyr: undefined, found: false };
  }
  const sex = INDEXES.sexByName[canonical];
  const vocative = INDEXES.vocativeByName[canonical];
  const vocativeCyr = vocative ? toCyrillic(vocative) : undefined;
  return { name: canonical, sex, vocative, vocativeCyr, found: true };
}

module.exports = dekl;
module.exports.dekl = dekl;
module.exports.toCyrillic = toCyrillic;
module.exports.default = dekl;

